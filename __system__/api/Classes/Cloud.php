<?php
    class Cloud
    {
        const ROOT = '__system__/assets/cloud/';

        public static function getFolderContent($path = "", $withFiles = true)
        {
            $folderPath  = '__system__/assets/cloud/' . $path;

            $data = [
                "status" => 1,
                "folder" => []
            ];
            if ($withFiles) $data["file"] = [];
            
            if (is_dir($folderPath)) {
                if (!dir($folderPath)) {
                    $data['status'] = 0;
                    $data['error'] = 'An unexpected error occurred to get folder content.';
                } else {
                    $directory = dir($folderPath);

                    while ($name = $directory->read()) {
                        if ($name === '.' || $name === '..') {
                            continue;
                        }
                        
                        if (is_dir($folderPath . '/' . $name)) {
                            array_push($data["folder"], [
                                'name' => $name
                            ]);
                        } else {
                            if (isset($data["file"])) {
                                array_push($data["file"], [
                                    'name' => $name
                                ]);
                            }
                        }
                    }
                }

                $directory->close();
                asort($data["folder"]);
                $data["folder"] = [ ...$data["folder"] ];

                if (isset($data["file"])) {
                    asort($data["file"]);
                    $data["file"] = [ ...$data["file"] ];
                }
            } else {
                $data['status'] = 0;
                $data['error'] = "The folder {$path} isn't a valid path.";
            }

            return $data;
        }

        public static function validateCloudsName(string $cloudsName)
        {
            $cloudsName = Project::nameFormatter($cloudsName);
            $folderPath  = Cloud::ROOT . $cloudsName;

            $data = [ "status" => 1, "cloudsName" => $cloudsName ];
            
            if (!Cloud::invalidCharacters($cloudsName)) {
                if ($cloudsName !== "") {
                    if (is_dir($folderPath)) {
                        $data['error'] = "&nbsp;<strong>{$cloudsName}</strong> &nbsp;is already a cloud name.";
                    }
                } else {
                    $data['error'] = "Enter your cloud's name, please.";
                }
            } else {
                $data['error'] = 'The characters &nbsp;<strong>\\ / | ? < > * : "</strong> &nbsp;are invalid';
            }

            if (isset($data['error'])) $data['status'] = 0;

            return $data;
        }

        public static function invalidCharacters(string $folderName): bool
        {
            $invalid = false;
            $invalidCharacters = ['\\', '/', '|', '?', '<', '>', '*', ':', '"'];

            foreach ($invalidCharacters as $v) {
                if (strstr($folderName, $v)) {
                    $invalid = true;
                    break;
                }
            }

            return $invalid;
        }

        public static function createFolder(string $folderName)
        {
            $created = false;
            if (mkdir(Cloud::ROOT . $folderName)) $created = true;

            return $created;
        }

        public static function clearFolder(string $folderPath, bool $delete = false)
        {
            $folderArray = explode('/', $folderPath);
            $nameFolder = $folderArray[count($folderArray) - 1];

            $iterator = new RecursiveDirectoryIterator(
                $folderPath, FilesystemIterator::SKIP_DOTS
            );
            $rec_iterator = new RecursiveIteratorIterator(
                $iterator, RecursiveIteratorIterator::CHILD_FIRST
            );

            foreach ($rec_iterator as $file) {
                $file->isFile() ? unlink($file->getPathname()) : rmdir($file->getPathname());
            }

            if ($delete && $nameFolder !== 'src') {
                rmdir($folderPath);
            }
        }
    }
