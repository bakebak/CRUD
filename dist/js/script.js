var host = {urlProduct:"http://localhost:3000/product"};
var mensagens = {
	disponibilidade:"Fruta não disponível!",
	deletada: "Fruta apagada!",
	comandoId: "Digite um ID para apagar!",
	alertaCampo: "Preencha todos os campos para adicionar uma nova fruta!",
	alertaCampoTamanho: "Nome da Fruta deve conter no mínimo três caracteres",
	confirmar: "Você tem certeza?",
	errorServer: "Servidor offline"
}
$(document).ready(function(){
	inicia();
	chamaLista();
	testeNegativo();
	testeLetra();
	testeNumero();

	
	$("#valor").maskMoney({showSymbol:true, symbol:"", decimal:".", thousands:","});

	$("#atualizar").click(function(){
		chamaLista();
	});
	$("#botao").click(function(){
		pesquisar();
	});
	$("#home").click(function(){
		inicia();

	});
	$("#adicionarFruta").click(function(){
		mostrarAdicionar();
	});
	$("#adicionar").click(function(event){
		adicionar(event);
	});
	$("#editar").click(function(){
		mostrarEditar();
	});
	$("#edit").click(function(event){
		editar(event);
	});
}); 

$(document).keypress(function(e) {
	if (e.which == 13) {
		pesquisar();
	}
});
function inicia(){
	/*chamaLista();*/
	esconde(['#dados','#novaFruta','#editar','#deletar','#home']);
	mostra(['#barraId','#botao','#adicionarFruta']);
}

function chamaLista(){
	$.getJSON(host.urlProduct, function (list){
		var lista = '';
		var i;
		var totalEstoque = 0;
		var valorTotalEstoque = 0;
		
        var valorTotal = 0;
		var valorCadaProduto=0;
		for(i=0; i < list.length; i++){
			lista += "<span class='"+list[i].status+"'>"+ list[i].id + " - " + list[i].nome + " - R$ " + list[i].valor + " - " + list[i].estoque +"</span><br>";
			valorCadaProduto = list[i].valor * list[i].estoque;
			valorTotal = valorCadaProduto + valorTotal;
			totalEstoque = list[i].estoque;
			valorTotalEstoque = valorTotalEstoque + totalEstoque;
		}
		lista += '<td>Valor total: R$'+valorTotal+'</td>';
		lista += '<td> Estoque total:'+valorTotalEstoque+'</td>';
		$("#disponivel").html(lista);
	})
	
	
	.fail(function() {
		confirm(mensagens.errorServer)
		//debugger;
		chamaLista();
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
}

function pesquisarNumero(entrada){
	$.getJSON(host.urlProduct + "/"+entrada, function (data){ //.getJSON faz uma requisição e o que retornar ele transforma em JSON
		escrevendoSaida(data);
		mostrarPesquisar();
		$("#deletar").click(function(){
			if(confirm(mensagens.confirmar)){
				deletar(data);
			}
		});
	})
	
	.fail(function() {
		$("#dados").html(mensagens.disponibilidade);
		ocultarNaoDisponivel();
	})
}

function pesquisarNome(entrada){
	var entradaMinuscula = entrada.toLowerCase();
	$.getJSON(host.urlProduct + "?nome="+ entradaMinuscula, function (data){ //.getJSON faz uma requisição e o que retornar ele transforma em JSON
		console.log(data.length);
		if (data.length != 0){
			escrevendoSaida(data[0]);
			mostrarPesquisar();
			$("#deletar").click(function(){
				if(confirm(mensagens.confirmar)){
					deletar(data[0]);
				}
			});
		}

		else {
			$("#dados").html(mensagens.disponibilidade);
			ocultarNaoDisponivel();
		}
	})
}


function pesquisar(){
	var entrada = $("#numero").val();
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

function deletar(data){
	mostrarPesquisar();
	var teste = data.id;
	$.ajax({
	    type: 'DELETE',
	    url: host.urlProduct + "/"+teste,
	    success: function(){
				mensagemDeletar();
				chamaLista();
	    }
	});
	ocultarAdicionar ();
	$("#dados").show();
	$("#editar").hide();
	$("#deletar").hide();
	$("#barraId").show();
}



function ajax (tipo,parametro){
	var nome = $("#nome").val();
	var	valor = $("#valor").val();
	var	estoque = $("#estoque").val();
	var	status = $('input[name=marcaStatus]:checked').val();
	var	nome = nome.toLowerCase();
		
	$.ajax({
		type: tipo,
		url: parametro,
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
		if(confirm(mensagens.confirmar)){
			ajax('PUT',host.urlProduct + "/" + entrada);
			limpa();
		}
		event.preventDefault();
	}
	else{
		alert(mensagens.alertaCampo);
		event.preventDefault();
	}
}

function adicionar(event){
	var entrada = $("#numero").val();
	var nomeTamanho = $("#nome").val();
	if(nomeTamanho !== '' && $("#valor") !== '' && $("#estoque").val() !== ''){
		if (nomeTamanho.length > 2){
			if(confirm(mensagens.confirmar)){
				ajax('POST',host.urlProduct);
				limpa();
			}
			event.preventDefault();
		}
		else {
			alert(mensagens.alertaCampoTamanho);
			event.preventDefault();
		}
	}

	else{
		alert(mensagens.alertaCampo);
		event.preventDefault();
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
	mostra(['#editar','#deletar']);
}
function ocultarNaoDisponivel(){
	esconde(['#editar','#deletar']);
}

function mostrarEditar(){
	esconde(['#dados','#adicionar','#editar','#deletar']);
	mostra(['#novaFruta','#edit','#barraId','#home']);
}

function mostrarAdicionar(){
	esconde(['#dados','#edit','#editar','#deletar','#botao','#barraId','#adicionarFruta']);
	mostra(['#novaFruta','#adicionar','#home']);
}

function ocultarAdicionar(){
	esconde(['#novaFruta']);
}

function esconde (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).hide();
	}
}

function mostra (array){
	for (var x=0; x<array.length; x++){
		$(array[x]).show();
	}
}

function limpa(){
	$('.caixa').val('');
}


