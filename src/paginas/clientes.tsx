import React, { Component, FormEvent } from 'react';

type Cliente = {
  nome: string;
  nomeSocial: string;
  cpf: string;
  dataEmissao: string;
  rgs: string[];
  telefones: string[];
  dataCadastro: string;
};

type Produto = {
  nome: string;
  preco: number;
  codigo: string;
};

type Servico = {
  nome: string;
  preco: number;
  duracao: number;
  codigo: string;
};

type Pet = {
  id: number;
  nome: string;
  tipo: string;
  genero: string;
  raca: string;
  cpfDono: string;
};

type ProdutoOuServico = {
  codigo: string;
  quantidade: number;
};

type Consumo = {
  cpfCliente: string;
  idPet: number;
  itens: ProdutoOuServico[];
  data: string;
};

type Props = {
  clientes: Cliente[];
  pets: Pet[];
  consumos: Consumo[];
  onSalvar: (cliente: Cliente, indice: number | null) => void;
  onExcluir: (indice: number) => void;
  onRegistrarConsumo: (consumo: Consumo) => void;
  produtos: Produto[];
  serv: Servico[];
};

type State = {
  nome: string;
  nomeSocial: string;
  cpf: string;
  dataEmissao: string;
  rgAtual: string;
  telefoneAtual: string;
  rgs: string[];
  telefones: string[];
  editando: boolean;
  indiceEditando: number | null;

  registrandoConsumoCPF: string | null;
  idPetSelecionado: number | null;
  codigoAtual: string;
  quantidadeAtual: number;
  itensConsumo: ProdutoOuServico[];
};

export default class PaginaClientes extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nome: '',
      nomeSocial: '',
      cpf: '',
      dataEmissao: '',
      rgAtual: '',
      telefoneAtual: '',
      rgs: [],
      telefones: [],
      editando: false,
      indiceEditando: null,

      registrandoConsumoCPF: null,
      idPetSelecionado: null,
      codigoAtual: '',
      quantidadeAtual: 1,
      itensConsumo: [],
    };
  }

  handleAdicionarRg = () => {
    const { rgAtual, rgs } = this.state;
    if (rgAtual.trim()) {
      this.setState({ rgs: [...rgs, rgAtual.trim()], rgAtual: '' });
    }
  };

  handleAdicionarTelefone = () => {
    const { telefoneAtual, telefones } = this.state;
    if (telefoneAtual.trim()) {
      this.setState({ telefones: [...telefones, telefoneAtual.trim()], telefoneAtual: '' });
    }
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const {
      nome,
      nomeSocial,
      cpf,
      dataEmissao,
      rgs,
      telefones,
      editando,
      indiceEditando,
    } = this.state;

    const novoCliente: Cliente = {
      nome,
      nomeSocial,
      cpf,
      dataEmissao,
      rgs,
      telefones,
      dataCadastro: new Date().toLocaleDateString(),
    };

    this.props.onSalvar(novoCliente, editando ? indiceEditando : null);

    this.setState({
      nome: '',
      nomeSocial: '',
      cpf: '',
      dataEmissao: '',
      rgAtual: '',
      telefoneAtual: '',
      rgs: [],
      telefones: [],
      editando: false,
      indiceEditando: null,
    });
  };

  handleEditar = (cliente: Cliente, index: number) => {
    this.setState({
      nome: cliente.nome,
      nomeSocial: cliente.nomeSocial,
      cpf: cliente.cpf,
      dataEmissao: cliente.dataEmissao,
      rgs: [...cliente.rgs],
      telefones: [...cliente.telefones],
      editando: true,
      indiceEditando: index,
    });
  };

  iniciarRegistroConsumo = (cpf: string) => {
    this.setState({
      registrandoConsumoCPF: cpf,
      idPetSelecionado: null,
      codigoAtual: '',
      quantidadeAtual: 1,
      itensConsumo: [],
    });
  };

  adicionarItemConsumo = () => {
    const { codigoAtual, quantidadeAtual, itensConsumo } = this.state;
    if (codigoAtual.trim() && quantidadeAtual > 0) {
      this.setState({
        itensConsumo: [...itensConsumo, { codigo: codigoAtual.trim(), quantidade: quantidadeAtual }],
        codigoAtual: '',
        quantidadeAtual: 1,
      });
    }
  };

  finalizarRegistroConsumo = () => {
    const { registrandoConsumoCPF, idPetSelecionado, itensConsumo } = this.state;
    if (registrandoConsumoCPF && idPetSelecionado && itensConsumo.length > 0) {
      const consumo: Consumo = {
        cpfCliente: registrandoConsumoCPF,
        idPet: idPetSelecionado,
        itens: itensConsumo,
        data: new Date().toLocaleDateString(),
      };
      this.props.onRegistrarConsumo(consumo);
      this.setState({
        registrandoConsumoCPF: null,
        idPetSelecionado: null,
        itensConsumo: [],
      });
    }
  };

  getTopClientesMaisConsumiram(): { cpf: string; nome: string; total: number }[] {
  const { clientes, consumos } = this.props;

  const contagem: Record<string, number> = {};

  consumos.forEach(consumo => {
    const totalItens = consumo.itens.reduce((soma, item) => soma + item.quantidade, 0);
    contagem[consumo.cpfCliente] = (contagem[consumo.cpfCliente] || 0) + totalItens;
  });

  return Object.entries(contagem)
    .map(([cpf, total]) => {
      const cliente = clientes.find(c => c.cpf === cpf);
      return {
        cpf,
        nome: cliente ? cliente.nome : 'Cliente não encontrado',
        total,
      };
    })
    .filter(c => c.nome !== 'Cliente não encontrado')
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

getTopClientesPorValor(): { cpf: string; nome: string; valor: number }[] {
  const { clientes, consumos, produtos, serv } = this.props;

  const precos: Record<string, number> = {};

  produtos.forEach(p => { precos[p.codigo] = p.preco; });
  serv.forEach(s => { precos[s.codigo] = s.preco; });

  const totais: Record<string, number> = {};

  consumos.forEach(consumo => {
    const total = consumo.itens.reduce((soma, item) => {
      const preco = precos[item.codigo] || 0;
      return soma + preco * item.quantidade;
    }, 0);
    totais[consumo.cpfCliente] = (totais[consumo.cpfCliente] || 0) + total;
  });

  return Object.entries(totais)
    .map(([cpf, valor]) => {
      const cliente = clientes.find(c => c.cpf === cpf);
      return {
        cpf,
        nome: cliente ? cliente.nome : 'Cliente não encontrado',
        valor,
      };
    })
    .filter(c => c.nome !== 'Cliente não encontrado')
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);
}

  render() {
    const {
      nome,
      nomeSocial,
      cpf,
      dataEmissao,
      rgAtual,
      telefoneAtual,
      rgs,
      telefones,
      editando,
      registrandoConsumoCPF,
      idPetSelecionado,
      codigoAtual,
      quantidadeAtual,
      itensConsumo,
    } = this.state;

    const { clientes, pets, consumos, onExcluir } = this.props;

    return (
      <div className="container mt-5 pt-5">
        <h2 className="text-center">Gerência de Clientes</h2>

        {/* Formulário de cadastro */}
        <div className="d-flex justify-content-center">
          <form onSubmit={this.handleSubmit} className="row g-3 mb-4 w-75">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Nome"
                value={nome}
                onChange={(e) => this.setState({ nome: e.target.value })}
                required
              />
              <input
                type="text"
                className="form-control mt-2"
                placeholder="Nome Social"
                value={nomeSocial}
                onChange={(e) => this.setState({ nomeSocial: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => this.setState({ cpf: e.target.value })}
                required
              />
              <input
                type="date"
                className="form-control mt-2"
                value={dataEmissao}
                onChange={(e) => this.setState({ dataEmissao: e.target.value })}
                required
              />
            </div>

            <div className="col-md-6 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="RG"
                value={rgAtual}
                onChange={(e) => this.setState({ rgAtual: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={this.handleAdicionarRg}>+</button>
            </div>

            <div className="col-md-6 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Telefone"
                value={telefoneAtual}
                onChange={(e) => this.setState({ telefoneAtual: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={this.handleAdicionarTelefone}>+</button>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary">
                {editando ? 'Salvar Alterações' : 'Cadastrar Cliente'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de clientes */}
        <ul className="list-group">
          {clientes.map((cliente, index) => {
            const consumosDoCliente = consumos.filter(c => c.cpfCliente === cliente.cpf);
            return (
              <li key={index} className="list-group-item">
                <div><strong>Nome:</strong> {cliente.nome}</div>
                <div><strong>CPF:</strong> {cliente.cpf}</div>
                <div><strong>Telefones:</strong> {cliente.telefones.join(', ')}</div>
                <div><strong>RGs:</strong> {cliente.rgs.join(', ')}</div>

                <div className="mt-2">
                  <button className="btn btn-sm btn-warning me-2" onClick={() => this.handleEditar(cliente, index)}>Editar</button>
                  <button className="btn btn-sm btn-danger me-2" onClick={() => onExcluir(index)}>Excluir</button>
                  <button className="btn btn-sm btn-success" onClick={() => this.iniciarRegistroConsumo(cliente.cpf)}>Registrar Consumo</button>
                </div>

                {/* Registro de consumo */}
                {registrandoConsumoCPF === cliente.cpf && (
                  <div className="mt-3 border rounded p-3">
                    <h6>Registro de Consumo</h6>
                    <select
                      className="form-select mb-2"
                      value={idPetSelecionado ?? ''}
                      onChange={(e) => this.setState({ idPetSelecionado: Number(e.target.value) })}
                    >
                      <option value="">Selecione o Pet</option>
                      {pets.filter(p => p.cpfDono === cliente.cpf).map(pet => (
                        <option key={pet.id} value={pet.id}>
                          {pet.nome} ({pet.tipo}, {pet.raca})
                        </option>
                      ))}
                    </select>

                    <div className="d-flex mb-2">
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Código do Produto/Serviço"
                        value={codigoAtual}
                        onChange={(e) => this.setState({ codigoAtual: e.target.value })}
                      />
                      <input
                        type="number"
                        className="form-control me-2"
                        placeholder="Qtd"
                        value={quantidadeAtual}
                        min={1}
                        onChange={(e) => this.setState({ quantidadeAtual: Number(e.target.value) })}
                      />
                      <button type="button" className="btn btn-outline-secondary" onClick={this.adicionarItemConsumo}>+</button>
                    </div>

                    {itensConsumo.length > 0 && (
                      <ul className="list-group mb-2">
                        {itensConsumo.map((item, i) => (
                          <li key={i} className="list-group-item">
                            {item.codigo} - {item.quantidade} unid.
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.finalizarRegistroConsumo}
                      disabled={!idPetSelecionado || itensConsumo.length === 0}
                    >
                      Salvar Consumo
                    </button>
                  </div>
                )}

                {/* Histórico de consumos */}
                {consumosDoCliente.length > 0 && (
                  <div className="mt-3">
                    <h6>Histórico de Consumos</h6>
                    <ul className="list-group">
                      {consumosDoCliente.map((consumo, i) => {
                        const pet = pets.find(p => p.id === consumo.idPet);
                        return (
                          <li key={i} className="list-group-item">
                            <div><strong>Data:</strong> {consumo.data}</div>
                            <div><strong>Pet:</strong> {pet ? `${pet.nome} (${pet.tipo})` : 'Pet não encontrado'}</div>
                            <div><strong>Itens:</strong></div>
                            <ul>
                              {consumo.itens.map((item, j) => (
                                <li key={j}>{item.codigo} - {item.quantidade} unid.</li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {clientes.length > 0 && this.getTopClientesMaisConsumiram().length > 0 && (
  <div className="mt-5">
    <h5 className="mb-3">Top 10 Clientes que Mais Consumiram em quantidade</h5>
    <ul className="list-group">
      {this.getTopClientesMaisConsumiram().map((cliente, index) => (
        <li key={index} className="list-group-item">
          <strong>{cliente.nome}</strong> — {cliente.total} itens consumidos
        </li>
      ))}
    </ul>
  </div>
)}

    {clientes.length > 0 && this.getTopClientesPorValor().length > 0 && (
  <div className="mt-4">
    <h5 className="mb-3">Top 5 Clientes que Mais Consumiram em valor (R$)</h5>
    <ul className="list-group">
      {this.getTopClientesPorValor().map((cliente, index) => (
        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
          <span><strong>{cliente.nome}</strong></span>
          <span className="badge bg-primary rounded-pill">
            R$ {cliente.valor.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}    

      </div>
    );
  }
}
