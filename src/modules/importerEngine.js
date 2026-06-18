async function calcularImportacao(nome, custoFOB, frete) {
    const custoFinal = custoFOB + frete;
    return { nome, custoFinal, status: "pendente", origem: "Importado" };
}
module.exports = { calcularImportacao };
