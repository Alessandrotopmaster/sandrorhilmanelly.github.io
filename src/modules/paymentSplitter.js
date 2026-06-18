function calcularDivisaoVenda(valor) {
    const comissaoAfiliado = valor * 0.10;
    const taxaPlataforma = valor * 0.05;
    return { valorTotal: valor, afiliado: comissaoAfiliado, plataforma: taxaPlataforma };
}
module.exports = { calcularDivisaoVenda };
