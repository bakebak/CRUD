var host = {urlProduct:"http://localhost:3000/product"};
var mensagens = {
	disponibilidade:"Fruta não disponível!",
	deletada: "Fruta apagada!",
	comandoId: "Digite um ID para apagar!",
	alertaCampo: "Preencha todos os campos para adicionar uma nova fruta!",
}

$(document).keypress(function(e) {
	if (e.which == 13) {
		pesquisar();
	}
});

function chamaLista(){
	$.getJSON(host.urlProduct, function (list){
		var lista = '';
		var i;
		for(i=0; i < list.length; i++){
			lista += "<span class='"+list[i].status+"'>"+ list[i].id + " - " + list[i].nome + " - R$ " + list[i].valor + "</span><br>";
		}
		$("#disponivel").html(lista);
	})
}

function escrevendoSaida(data){
	var saida = "";
	saida = "Fruta: " + data.nome + "<br>" +
	"Valor: R$ " + data.valor + "<br>" +
	"Status: " + data.status + "<br>" +
	"Estoque: " + data.estoque + "<br>";
	$("#dados").html(saida);
}

function chamaIndividual(entrada){
	valor = isNaN(entrada);
	if (valor == false){
		pesquisarNumero(entrada);
	}
	
	else if (valor == true){
		pesquisarNome(entrada);
	}
	
	mostrarPesquisar();
}

function pesquisarNumero(entrada){
	$.getJSON(host.urlProduct + "/"+entrada, function (data){ //.getJSON faz uma requisição e o que retornar ele transforma em JSON
		escrevendoSaida(data);
	})
	
	/*.fail(function() {
		$("#dados").html(mensagens.disponibilidade);
	})*/
}

function pesquisarNome(entrada){
	var entradaMinuscula = entrada.toLowerCase();
	$.getJSON(host.urlProduct + "?nome="+entradaMinuscula, function (data){ //.getJSON faz uma requisição e o que retornar ele transforma em JSON
		escrevendoSaida(data[0]);
	})
	
	/*.fail(function() {
		$("#dados").html(mensagens.disponibilidade);
	})*/
}


function pesquisar(){
	var entrada = $("#numero").val();
	console.log(entrada);
		if (entrada !== ""){
			chamaIndividual(entrada);
			ocultarAdicionar ();
		}
		
		else if (entrada == "") {
			$("#dados").html(mensagens.disponibilidade);	
			ocultarNaoDisponivel();
		}
		$("#dados").show();
}

function mensagemDeletar(){
	var entrada = $("#numero").val();
	if (entrada !=''){
		$("#dados").html(mensagens.deletada);
	}
	else{
		$("#dados").html(mensagens.comandoId);
		$("#dados").show();
	}
}

function deletar(){
	var entrada = $("#numero").val();
	$.ajax({
	    type: 'DELETE',
	    url: host.urlProduct + entrada,
	    success: function(){
	    	chamaLista();
	    }
	});
	ocultarAdicionar ();
	$("#dados").show();
	mensagemDeletar();
	$("#editar").hide();
	$("#deletar").hide();
	$("#barraId").show();
}

function ajax (tipo,link){
	var nome = $("#nome").val();
		valor = $("#valor").val();
		estoque = $("#estoque").val();
		status = $('input[name=marcaStatus]:checked').val();

	nome = nome.toLowerCase();
	$.ajax({
		type: tipo,
		url: link,
		data: {
			nome: nome,
			valor: valor,
			status: status,
			estoque: estoque,
		},
		success: function(){
			chamaLista();
		}
	});
}

function editar(){
	entrada = $("#numero").val();
	if($("#nome").val() !== '' && $("#valor").val() !== '' && $("#estoque").val() !== ''){
		ajax('PUT',host.urlProduct + entrada);
	}
	else{
		alert(mensagens.alertaCampo);
	}
}

function adicionar(){
	valor = $("#valor").val();
	if($("#nome").val() !== '' && valor !== '' && $("#estoque").val() !== ''){
		ajax('POST',host.urlProduct);
	}
	else{
		alert(mensagens.alertaCampo);
	}
}


function testeNegativo(){
	$("input").keyup(function(e){
		var code = e.keyCode || e.wich;
		if (code == 109 || code == 189){
			var valor = $(this).val();
			$(this).val(valor.replace(/[-]/g,''))
		}
	});
}

function testeLetra(){
	$("#nome").keyup(function(){
		var letras = $(this).val();
		$(this).val(letras.replace(/[^a-zA-Záàâãéèêíïóôõöúçñ ]+/g,''));
	});
}

function testeNumero(){
	$("#valor, #estoque").keyup(function(){
		var valor = $(this).val();
		$(this).val(valor.replace(/[^0-9.]+/g,''));
	});
}

function mostrarPesquisar(){
	$("#editar").show();
	$("#deletar").show();	
}

function ocultarNaoDisponivel(){
	$("#editar").hide();
	$("#deletar").hide();
}

function mostrarEditar(){
	$("#dados").hide();
    $("#novaFruta").show();
    $("#adicionar").hide();
    $("#edit").show();
    $("#editar").hide();
	$("#deletar").hide();
	$("#barraId").show();
}

function mostrarAdicionar(){
	$("#dados").hide();
    $("#novaFruta").show();
    $("#edit").hide();
    $("#adicionar").show();
    $("#editar").hide();
	$("#deletar").hide();
	$("#barraId").hide();
	$("#botao").hide();
	$("#adicionarFruta").hide();
}

function ocultarAdicionar(){
	$("#novaFruta").hide();
}

function inicia(){
	chamaLista();
	$("#dados").hide();
	$("#novaFruta").hide();
	$("#editar").hide();
	$("#deletar").hide();
	$("#barraId").show();
}

$(document).ready(function(){
	inicia();
	testeNegativo();
	testeLetra();
	testeNumero();
	
	$("#atualizar").click(function(){
		chamaLista();
	});
	$("#botao").click(function(){
		pesquisar();
	});
	$("#deletar").click(function(){
		deletar();
	});
	$("#adicionarFruta").click(function(){
		mostrarAdicionar();
	});
	$("#adicionar").click(function(){
		adicionar();
	});
	$("#editar").click(function(){
		mostrarEditar();
	});
	$("#edit").click(function(){
		editar();
	});
}); 
