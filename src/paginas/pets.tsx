import React, { Component } from 'react';

type Pet = {
  id: number;
  nome: string;
  tipo: string;
  genero: string;
  raca: string;
  cpfDono: string; // novo campo
};

type Props = {
  pets: Pet[];
  onSalvar: (pet: Pet, indice: number | null) => void;
  onExcluir: (id: number) => void;
};

type State = {
  nome: string;
  tipo: string;
  genero: string;
  raca: string;
  cpfDono: string;
  editando: boolean;
  idEdicao: number | null;
};

export default class PaginaPets extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      nome: '',
      tipo: '',
      genero: '',
      raca: '',
      cpfDono: '',
      editando: false,
      idEdicao: null,
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { nome, tipo, genero, raca, cpfDono, editando, idEdicao } = this.state;

    const novoPet: Pet = {
      id: editando && idEdicao !== null ? idEdicao : Date.now(),
      nome,
      tipo,
      genero,
      raca,
      cpfDono,
    };

    const indice = editando && idEdicao !== null
      ? this.props.pets.findIndex(p => p.id === idEdicao)
      : null;

    this.props.onSalvar(novoPet, indice);
    this.setState({
      nome: '',
      tipo: '',
      genero: '',
      raca: '',
      cpfDono: '',
      editando: false,
      idEdicao: null,
    });
  };

  handleEditar = (pet: Pet) => {
    this.setState({
      nome: pet.nome,
      tipo: pet.tipo,
      genero: pet.genero,
      raca: pet.raca,
      cpfDono: pet.cpfDono,
      editando: true,
      idEdicao: pet.id,
    });
  };

  render() {
    const { pets, onExcluir } = this.props;
    const { nome, tipo, genero, raca, cpfDono, editando } = this.state;

    return (
      <div className="container mt-5 pt-5">
        <h2 className="text-center">Gerência de Pets</h2>
        <p className="text-center">Cadastre um pet e vincule-o ao CPF do cliente responsável.</p>

        <div className='mt-5 pt-5'>
          <h5 className='mb-3 text-center'>Cadastro de Pet</h5>
          <form onSubmit={this.handleSubmit} className="mb-4">
            <div className="row">
              <div className="col-md-6">
                <input type="text" className="form-control mb-3" placeholder="Nome do Pet" value={nome} onChange={e => this.setState({ nome: e.target.value })} required />
                <input type="text" className="form-control mb-3" placeholder="Tipo" value={tipo} onChange={e => this.setState({ tipo: e.target.value })} required />
                <input type="text" className="form-control mb-3" placeholder="CPF do Dono" value={cpfDono} onChange={e => this.setState({ cpfDono: e.target.value })} required />
              </div>

              <div className="col-md-6">
                <input type="text" className="form-control mb-3" placeholder="Raça" value={raca} onChange={e => this.setState({ raca: e.target.value })} required />
                <input type="text" className="form-control mb-3" placeholder="Gênero" value={genero} onChange={e => this.setState({ genero: e.target.value })} required />
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary">
                {editando ? 'Salvar Alterações' : 'Cadastrar Pet'}
              </button>
            </div>
          </form>
        </div>

        <div className="list-group mt-5">
          {pets.length === 0 && (
            <p className="text-center text-muted">Nenhum pet cadastrado ainda.</p>
          )}
          {pets.map(pet => (
            <div key={pet.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{pet.nome}</h5>
                <small className="text-muted">{pet.tipo} - {pet.raca} - {pet.genero}</small><br />
                <small><strong>Dono (CPF):</strong> {pet.cpfDono}</small>
              </div>
              <div>
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => this.handleEditar(pet)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => onExcluir(pet.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

