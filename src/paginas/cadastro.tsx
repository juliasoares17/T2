import React, { Component, FormEvent } from 'react';

type Props = {
  onCadastroConcluido: () => void;
};

export default class PaginaCadastro extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Aqui você pode simular o cadastro e redirecionar para o login
    alert('Cadastro realizado com sucesso!');
    this.props.onCadastroConcluido();
  }

  render() {
    return (
      <div className="container mt-5" style={{ maxWidth: '600px' }}>
        <h3 className="text-center mb-4">Cadastro</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input type="text" className="form-control" placeholder="Seu nome completo" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Seu e-mail" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" placeholder="Crie uma senha" required />
          </div>
          <button type="submit" className="btn btn-success w-100">Cadastrar</button>
        </form>
      </div>
    );
  }
}
