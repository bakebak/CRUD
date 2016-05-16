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
	
	.fail(function() {
		$("#dados").html(mensagens.disponibilidade);
	})
}

function pesquisarNome(entrada){
	$.getJSON(host.urlProduct + "?nome="+entrada, function (data){ //.getJSON faz uma requisição e o que retornar ele transforma em JSON
	escrevendoSaida(data[0]);
	})
}

function pesquisar(){
	var entrada = $("#numero").val();
		chamaIndividual(entrada);
		ocultarAdicionar ();
		$("#dados").show();
}

function mensagemDeletar(){
	var entrada = $("#numero").val();
	if (entrada !=''){
		$("#dados").html(mensagens.deletada);
	}
	else{
		$("#dados").html(mensagens.comandoId);
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
	if($("#nome").val() !== '' && $("#valor").val() !== '' && $("#estoque").val() !== ''){
		ajax('POST',host.urlProduct);
	}
	else{
		alert(mensagens.alertaCampo);
	}
}

function mostrarPesquisar(){
	$("#editar").show();
	$("#deletar").show();
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
