import React, { Component, FormEvent } from 'react';

type Produto = {
  nome: string;
  preco: number;
  codigo: string; // 6 dígitos numéricos como string
};

type ProdutoRanking = {
  codigo: string;
  nome: string;
  total: number;
};

type Consumo = {
  cpfCliente: string;
  idPet: number;
  itens: { codigo: string; quantidade: number }[];
  data: string;
};

type Pet = {
  id: number;
  nome: string;
  tipo: string;
  genero: string;
  raca: string;
  cpfDono: string;
};

type Props = {
  produtos: Produto[];
  consumos: Consumo[];
  pets: Pet[];
  onSalvar: (produto: Produto, indice: number | null) => void;
  onExcluir: (indice: number) => void;
};

type State = {
  nome: string;
  preco: string;
  codigo: string;
  editando: boolean;
  indiceEditando: number | null;
};

export default class PaginaProdutos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nome: '',
      preco: '',
      codigo: '',
      editando: false,
      indiceEditando: null,
    };
  }

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { nome, preco, codigo, indiceEditando } = this.state;

    if (!/^\d{6}$/.test(codigo)) {
      alert('O código deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    const novoProduto: Produto = {
      nome,
      preco: parseFloat(preco),
      codigo,
    };

    this.props.onSalvar(novoProduto, indiceEditando);
    this.setState({
      nome: '',
      preco: '',
      codigo: '',
      editando: false,
      indiceEditando: null,
    });
  };

  handleEditar = (indice: number) => {
    const produto = this.props.produtos[indice];
    this.setState({
      nome: produto.nome,
      preco: produto.preco.toString(),
      codigo: produto.codigo,
      editando: true,
      indiceEditando: indice,
    });
  };

  getProdutosMaisConsumidos(): ProdutoRanking[] {
    const { consumos, produtos } = this.props;
    const contagem: Record<string, number> = {};

    consumos.forEach(consumo => {
      consumo.itens.forEach(item => {
        contagem[item.codigo] = (contagem[item.codigo] || 0) + item.quantidade;
      });
    });

    return Object.entries(contagem)
      .map(([codigo, total]) => {
        const produto = produtos.find(p => p.codigo === codigo);
        return {
          codigo,
          nome: produto ? produto.nome : 'Produto não encontrado',
          total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }

  getProdutosPorTipoRaca(): Record<string, Record<string, ProdutoRanking[]>> {
    const { consumos, produtos, pets } = this.props;
    const resultado: Record<string, Record<string, Record<string, number>>> = {};

    consumos.forEach(consumo => {
      const pet = pets.find(p => p.id === consumo.idPet);
      if (!pet) return;

      const tipo = pet.tipo;
      const raca = pet.raca;

      if (!resultado[tipo]) resultado[tipo] = {};
      if (!resultado[tipo][raca]) resultado[tipo][raca] = {};

      consumo.itens.forEach(item => {
        resultado[tipo][raca][item.codigo] = (resultado[tipo][raca][item.codigo] || 0) + item.quantidade;
      });
    });

    // Agora transformar em array de ProdutoRanking[]
    const convertidos: Record<string, Record<string, ProdutoRanking[]>> = {};

    for (const tipo in resultado) {
      convertidos[tipo] = {};
      for (const raca in resultado[tipo]) {
        convertidos[tipo][raca] = Object.entries(resultado[tipo][raca]).map(([codigo, total]) => {
          const produto = produtos.find(p => p.codigo === codigo);
          return {
            codigo,
            nome: produto ? produto.nome : 'Produto não encontrado',
            total,
          };
        });
      }
    }

    return convertidos;
  }

  render() {
    const { produtos, onExcluir } = this.props;
    const { nome, preco, codigo, editando } = this.state;

    const ranking = this.getProdutosMaisConsumidos();
    const agrupadoPorTipoRaca = this.getProdutosPorTipoRaca();

    return (
      <div className="container mt-5 pt-5">
        <h2 className="text-center">Gerência de Produtos</h2>
        <p className="text-center">Cadastre, edite e exclua produtos disponíveis em sua loja.</p>

        {/* Formulário de cadastro */}
        <div className="mt-5 pt-5">
          <h5 className="mb-3 text-center">Cadastro de Produto</h5>
          <form onSubmit={this.handleSubmit} className="row g-3 mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nome do Produto"
                value={nome}
                onChange={(e) => this.setState({ nome: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Preço (R$)"
                value={preco}
                onChange={(e) => this.setState({ preco: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Código (6 dígitos)"
                value={codigo}
                onChange={(e) => this.setState({ codigo: e.target.value })}
                maxLength={6}
                required
              />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">
                {editando ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de produtos */}
        <ul className="list-group mt-5">
          {produtos.length === 0 && (
            <p className="text-center text-muted">Nenhum produto cadastrado ainda.</p>
          )}
          {produtos.map((produto, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{produto.nome}</strong> — R${produto.preco.toFixed(2)} — Código: {produto.codigo}
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => this.handleEditar(index)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onExcluir(index)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Top 5 mais consumidos */}
        {ranking.length > 0 && (
          <div className="mt-5">
            <h5 className="mb-3">Top 5 Produtos Mais Consumidos</h5>
            <ul className="list-group">
              {ranking.map((produto, index) => (
                <li key={index} className="list-group-item">
                  <strong>{produto.nome}</strong> — {produto.total} unidades consumidas
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(agrupadoPorTipoRaca).length > 0 && (
          <div className="mt-5">
            <h5 className="mb-3">Produtos Consumidos por Tipo e Raça de Pet</h5>
            {Object.entries(agrupadoPorTipoRaca).map(([tipo, racas]) => (
              <div key={tipo} className="mb-4">
                <h6>{tipo}</h6>
                {Object.entries(racas).map(([raca, produtos]) => (
                  <div key={raca} className="ms-3 mb-3">
                    <strong>Raça: {raca}</strong>
                    <ul className="list-group mt-1">
                      {produtos.map((produto, i) => (
                        <li key={i} className="list-group-item">
                          {produto.nome} — {produto.total} unidades
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
