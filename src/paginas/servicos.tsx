import React, { Component, FormEvent } from 'react';

type Servico = {
  nome: string;
  preco: number;
  duracao: number;
  codigo: string;
};

type Consumo = {
  cpfCliente: string;
  idPet: number;
  itens: { codigo: string; quantidade: number }[];
  data: string;
};

type ServicoRanking = {
  codigo: string;
  nome: string;
  total: number;
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
  servicos: Servico[];
  consumos: Consumo[];
  pets: Pet[];
  onSalvar: (servico: Servico, indice: number | null) => void;
  onExcluir: (indice: number) => void;
};

type State = {
  nome: string;
  preco: string;
  duracao: string;
  codigo: string;
  editando: boolean;
  indiceEditando: number | null;
};

export default class PaginaServicos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nome: '',
      preco: '',
      duracao: '',
      codigo: '',
      editando: false,
      indiceEditando: null,
    };
  }

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { nome, preco, duracao, codigo, indiceEditando } = this.state;

    if (!/^\d{6}$/.test(codigo)) {
      alert('O código deve conter exatamente 6 dígitos numéricos.');
      return;
    }

    const novoServico: Servico = {
      nome,
      preco: parseFloat(preco),
      duracao: parseInt(duracao),
      codigo,
    };

    this.props.onSalvar(novoServico, indiceEditando);
    this.setState({
      nome: '',
      preco: '',
      duracao: '',
      codigo: '',
      editando: false,
      indiceEditando: null,
    });
  };

  handleEditar = (indice: number) => {
    const servico = this.props.servicos[indice];
    this.setState({
      nome: servico.nome,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
      codigo: servico.codigo,
      editando: true,
      indiceEditando: indice,
    });
  };

  getServicosMaisConsumidos(): ServicoRanking[] {
    const { consumos, servicos } = this.props;
    const contagem: Record<string, number> = {};

    consumos.forEach(consumo => {
      consumo.itens.forEach(item => {
        contagem[item.codigo] = (contagem[item.codigo] || 0) + item.quantidade;
      });
    });

    const ranking: ServicoRanking[] = Object.entries(contagem)
      .map(([codigo, total]) => {
        const servico = servicos.find(s => s.codigo === codigo);
        return {
          codigo,
          nome: servico ? servico.nome : 'Serviço não encontrado',
          total,
        };
      })
      .filter(r => r.nome !== 'Serviço não encontrado')
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return ranking;
  }

  getServicosPorTipoRaca(): Record<string, Record<string, ServicoRanking[]>> {
  const { consumos, servicos, pets } = this.props;
  const resultado: Record<string, Record<string, Record<string, number>>> = {};

  consumos.forEach(consumo => {
    const pet = pets.find(p => p.id === consumo.idPet);
    if (!pet) return;

    const tipo = pet.tipo;
    const raca = pet.raca;

    if (!resultado[tipo]) resultado[tipo] = {};
    if (!resultado[tipo][raca]) resultado[tipo][raca] = {};

    consumo.itens.forEach(item => {
      const servicoExiste = servicos.find(s => s.codigo === item.codigo);
      if (servicoExiste) {
        resultado[tipo][raca][item.codigo] = (resultado[tipo][raca][item.codigo] || 0) + item.quantidade;
      }
    });
  });

  const convertidos: Record<string, Record<string, ServicoRanking[]>> = {};

  for (const tipo in resultado) {
    convertidos[tipo] = {};
    for (const raca in resultado[tipo]) {
      convertidos[tipo][raca] = Object.entries(resultado[tipo][raca]).map(([codigo, total]) => {
        const servico = servicos.find(s => s.codigo === codigo);
        return {
          codigo,
          nome: servico ? servico.nome : 'Serviço não encontrado',
          total,
        };
      });
    }
  }

  return convertidos;
}

  render() {
    const { servicos, onExcluir } = this.props;
    const { nome, preco, duracao, codigo, editando } = this.state;

    const ranking = this.getServicosMaisConsumidos();

    return (
      <div className="container mt-5 pt-5">
        <h2 className="text-center">Gerência de Serviços</h2>
        <p className="text-center">Cadastre, edite e exclua os serviços prestados pela loja.</p>

        <div className="mt-5 pt-5">
          <h5 className="mb-3 text-center">Cadastro de Serviço</h5>
          <form onSubmit={this.handleSubmit} className="row g-3 mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Nome do Serviço"
                value={nome}
                onChange={(e) => this.setState({ nome: e.target.value })}
                required
              />
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
            <div className="col-md-6">
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Duração (min)"
                value={duracao}
                onChange={(e) => this.setState({ duracao: e.target.value })}
                required
              />
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
                {editando ? 'Salvar Alterações' : 'Cadastrar Serviço'}
              </button>
            </div>
          </form>
        </div>

        <ul className="list-group mt-4">
          {servicos.length === 0 && (
            <p className="text-center text-muted">Nenhum serviço cadastrado ainda.</p>
          )}
          {servicos.map((servico, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{servico.nome}</strong> — R${servico.preco.toFixed(2)} —{' '}
                {servico.duracao} min — Código: {servico.codigo}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => this.handleEditar(index)}
                >
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => onExcluir(index)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Ranking de serviços mais consumidos */}
        {ranking.length > 0 && (
          <div className="mt-5">
            <h5 className="mb-3">Top 5 Serviços Mais Consumidos</h5>
            <ul className="list-group">
              {ranking.map((servico, index) => (
                <li key={index} className="list-group-item">
                  <strong>{servico.nome}</strong> — realizado {servico.total} vezes
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.keys(this.getServicosPorTipoRaca()).length > 0 && (
  <div className="mt-5">
    <h5 className="mb-3">Serviços Consumidos por Tipo e Raça de Pet</h5>
    {Object.entries(this.getServicosPorTipoRaca()).map(([tipo, racas]) => (
      <div key={tipo} className="mb-4">
        <h6>{tipo}</h6>
        {Object.entries(racas).map(([raca, servicos]) => (
          <div key={raca} className="ms-3 mb-3">
            <strong>Raça: {raca}</strong>
            <ul className="list-group mt-1">
              {servicos.map((servico, i) => (
                <li key={i} className="list-group-item">
                  {servico.nome} — {servico.total} vezes
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
