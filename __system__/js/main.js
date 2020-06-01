const BASE_URL = "http://localhost/file-manager/"
const BASE_URL2 = "http://localhost/file-manager/__system__/"
const ROOT_CLOUD = "http://localhost/file-manager/cloud/"
const ROOT_CLOUD2 = "http://localhost/file-manager/__system__/assets/cloud"

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 5000
})

const information = () => {
	$(".spanInformation").click(function (e) {
		var message = $(this).attr("data-inf")

		Toast.fire({
			title: message
		})

		e.preventDefault()
	})
}

const loadingRes = (message = "") => {
	return `<p class='p-loading'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${message}</p>`;
}

const loadingResSmall = (message = "") => {
	return `<small class='smallAnswer'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${message}</small>`;
}

const clearAndGetHelpBlock = () => {
	const helpBlock = document.querySelector('.help-block')
	helpBlock.innerHTML = ``
	helpBlock.classList.remove('error', 'success')

	return helpBlock
}

(function ($) {
	$.fn.focusTextToEnd = function () {
		this.focus()
		var $thisVal = this.val()
		this.val('').val($thisVal)
		return this
	}
}(jQuery))

information()