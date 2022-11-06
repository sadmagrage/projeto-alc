let fii_user = [];
let fii_table = [];

async function carregarDadosUser(url){
    await fetch(url)
            .then(resp => resp.json())
            .then(json => fii_user = json);
    carregarDadosFundos();
}

async function carregarDadosFundos(){
    
    for (let fii of fii_user){
        let json = await fetch(`https://api-simple-flask.herokuapp.com/api/${fii.nome}`)
                        .then(resp => resp.json());
        fii_table.push(json);
        console.log(fii_table)
    }
    const img = document.querySelector("#loading") ;
    img.style.display = "none";
    exibirTabela();
}

carregarDadosUser("json/fii.json");

function exibirTabela(){ 
   //DECLARAÇÃO DAS VARIÁVEIS DO FINAL DA TABELA
   let  totalCotas = 0;
   let  totalInvestido = 0;
    
   //LOOP PARA GERAR CADA LINHA DA TABELA
   for (i = 0; i < fii_table.length; i++){
    const createTr = document.createElement('tr');
    createTr.innerHTML = `
    <td>${fii_table[i].fundo}</td>
    <td>${fii_table[i].setor}</td>
    <td>${fii_table[i].proximoRendimento.dataBase == "-" ? fii_table[i].ultimoRendimento.dataBase : fii_table[i].proximoRendimento.dataBase}</td>
    <td>${fii_table[i].proximoRendimento.dataPag == "-" ? fii_table[i].ultimoRendimento.dataPag : fii_table[i].proximoRendimento.dataPag}</td>
    <td>R$${fii_table[i].proximoRendimento.dataPag == "-" ? fii_table[i].ultimoRendimento.rendimento : fii_table[i].proximoRendimento.rendimento}</td>
    <td>R$${fii_table[i].proximoRendimento.dataPag == "-" ? fii_table[i].ultimoRendimento.cotaBase : fii_table[i].proximoRendimento.cotaBase}</td>
    <td>${fii_user[i].qtde}</td>
    <td>R$${fii_user[i].totalgasto.toFixed(2)}</td>
    <td>R$${(fii_user[i].totalgasto/fii_user[i].qtde).toFixed(2)}</td>
    <td>${(fii_table[i].ultimoRendimento.rendimento*100/fii_table[i].valorAtual).toFixed(2)}%</td>
    <td>${fii_table[i].dividendYield}%</td>
    <td>R$${fii_table[i].rendimentoMedio24M.toFixed(2)}</td>
    `

    //VARIÁVEIS QUE REPRESENTAM O VALOR FINAL DA TR
    totalCotas += fii_user[i].qtde;
    totalInvestido += fii_user[i].totalgasto;

    //CONDICIONAL PARA MUDAR A COR DE FUNDO DA TABELA DE FUNDOS QUE POSSUAM RENDIMENTO MENOR QUE 0.6
    if(fii_table[i].ultimoRendimento.rendimento > 0.5){
        createTr.style.backgroundColor = "rgb(130,193,235)"
    } else{
        createTr.style.backgroundColor = "rgb(255,151,125)"
    }

    //CONST DA TABELA E ANEXANDO UMA NOVA TR NO SEU FINAL À CADA LOOP DO FOR
    const table = document.querySelector("#table");
    table.appendChild(createTr);
   }

   //CONST IGUAL A OUTRA PARA GERAR UM TR, COMO USADA UMA VEZ SÓ FIZ FORA DE UM LAÇO FOR
   const createFinalTr = document.createElement('tr');
   createFinalTr.innerHTML = `<td colspan="4">Total Geral</td><td>R$${(totalInvestido/totalCotas).toFixed(2)}</td><td>-</td><td>${totalCotas}</td><td>R$${totalInvestido.toFixed(2)}</td><td>-</td><td>-</td><td>-</td><td>-</td>`
   createFinalTr.classList.add("lastTr")
   table.appendChild(createFinalTr);
}
