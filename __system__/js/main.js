//variável representando o tempo inativo atual
seg = 0
//Adicionando ao document o evento a ser disparado sempre que o mouse se mover
document.addEventListener("mousemove", function(e) {
    seg = 0
    e.preventDefault()
});

setInterval(function() {
  seg = seg + 5

  // 900 seg = 15 minutos
  if (seg >= 900) {
    $.ajax({
      dataType: 'json',
      url: BASE_URL + 'conta/logout',
      success: function(json) {
        if (json['logado'] === true) {
          location.href = BASE_URL + "conta/login?error=2";
        }
      }
    })
  }
}, 6000)

const BASE_URL = "http://localhost/casadacrianca/"
const BASE_URL2 = "http://localhost/casadacrianca/__system__/"

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000
})

const formatDatetimeToDate = (datetime) => {
  var date = datetime.split(" ")
  return date[0]
}

const formatRealToDolar = (real) => {
  if (real.indexOf(".") >= 0) {
    real = real.split(".").join("")
  }

  var exp = real.split(",")

  return Number(exp.join(".")).toFixed(2)
}

const formatDolarToReal = (dolar) => {
  var numero = dolar.toFixed(2).split('.')
  numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.')
  return numero.join(',')
}

const information = () => {
  $(".spanInformation").click(function(e) {
    var message = $(this).attr("data-inf")

    Toast.fire({
      title: message
    })

    e.preventDefault()
  })
}

const showModalErrors = (array) => {
  $(".textError").html(``)

  for (c = 0; c < array.length; c++) {
    $(".textError").append(`
      <a style="color:rgb(168, 42, 33);text-decoration:none;" class="linkSessions" data-div="${array[c][1]}" href="#${array[c][1]}">${array[c][0]}</a><br/>
    `)
  }

  ancoraLinks()
  $(".myModalError").css({'display': 'block'})
}

const ancoraLinks = () => {
  $(".linkSessions").click(function() {
    divAncora = $(this).attr("data-div")

    if ($("#" + divAncora).is(":hidden")) {
      $(".waitingListFormSubtitle > .resumirDiv").each((i, e) => {
        var nomeId = e.id
        var divId = "divSession" + nomeId
    
        if (divId == divAncora) {
          var action = $("#" + nomeId).attr("data-action")
    
          if (action == "show") {
            $("#" + nomeId).click()
          }
        }
      })
    }
  })
}

const notificationEvents = () => {
  var delay = 3000

  setTimeout(function() {

    $.ajax({
      dataType: 'json',
      url: BASE_URL + 'functions/gerenciaAgenda',
      success: function(json) {
        if (json['eventos'].length > 0) {
          $(".displayEvents").html(`
            <span class="closeDisplayEvents">&times;</span>
            <a href="${BASE_URL}agenda/central" style="text-decoration:none;color:#fff;" class="textDisplayEvents"></a>
          `)

          if (json['eventos'].length > 1) {
            $(".textDisplayEvents").html(`
              Você tem ${json['eventos'][0].quantity} eventos pendentes na agenda ${json['inf']}
            `)
          } else {
            $(".textDisplayEvents").html(`
              Você tem um evento pendente na agenda ${json['inf']}
            `)
          }

          $(".displayEvents").slideToggle()
          
          $(".closeDisplayEvents").click(function(e) {
            $(".displayEvents").slideToggle()
            e.preventDefault()
          })
        }
      }
    })

  }, delay)
}

$(".answerAnalise").click(function(e) {
  Toast.fire({
    type: 'warning',
    title: 'Esta área está em fase de análise'
  })
  
  e.preventDefault();
})

$('.btnLogout').click(function() {
  Swal.fire({
    title: "Deseja mesmo sair?",
    text: 'Caso você não tenha salvo qualquer tipo de dado(s), será perdido permanentemente!',
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ffd34e",
    confirmButtonText: "Sim, sair",
    cancelButtonColor: "#999",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if(result.value) {
      location.href = BASE_URL + "conta/logout";
    }
  });

  return false;
});

const loadingInterleaveRes = () => {
  const responseArray = [
    "Verificando o formulário...",
    "Há um grande tráfego de dados...",
    "Pode pode demorar alguns segundos...",
    "Esperando resposta..."
  ]
  var index = 1
  var count = responseArray.length

  intervalFunction = setInterval(function() {
    var answer = responseArray[index]

    if (index >= (count - 1)) {
      index = 0
    } else {
      index += 1
    }

    $(".help-block-lista").html(`<p class='p-loading'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${answer}</p>`)
  }, 1000);

  $(".help-block-lista").html(`<p class='p-loading'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${responseArray[0]}</p>`)
}

const clearIntervalFunction = () => {
  clearInterval(intervalFunction)
}

const loadingRes = (message = "") => {
  return `<p class='p-loading'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${message}</p>`;
}

const loadingResSmall = (message = "") => {
  return `<small class='smallAnswer'><i class='fa fa-circle-notch fa-spin'></i> &nbsp;${message}</small>`;
}

function clearErrors() {
  $(".help-block-login").html("");
  $(".help-block-lista").html("");
  $(".help-block").html("");
  $(".help-block-obs").html("");
  $(".help-block-perfil").html("");
}

function showErrors(error_list) {
  clearErrors();
  $.each(error_list, function(id, message) {
    $(id).siblings(".help-block").html(message);
  })
}

function showErrorsMudarSenha(error_list) {
  clearErrors();
  $.each(error_list, function(id, message) {
    $(id).siblings(".help-block-perfil").html(message);
  })
}

// Muda a cor do link da página atual

$(function(){
  $('a').each(function() {
    if ($(this).prop('href') == window.location.href) {
      $(this).addClass('current');
    }
  });
});

(function($){
  $.fn.focusTextToEnd = function(){
      this.focus()
      var $thisVal = this.val()
      this.val('').val($thisVal)
      return this
  }
}(jQuery))

// $('#mytext').focusTextToEnd();

// Abre div do usuário na sideBarNav

$(document).ready(function(){
  $(".userLink").click(function(){
    $("#userOptionsDiv").toggle('fast');
  });

  $(".closeDisplayInativate").click(function(e) {
    $(".displayInativate").slideToggle()
    e.preventDefault()
  })
});

information()
notificationEvents()

// $(document).ready(function(){
//   $(".btnTentativaContato").click(function(){
//     $("#tentativaContatoDiv").toggle('fast');
//   });
// });