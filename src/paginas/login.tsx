import React, { Component, FormEvent } from 'react';

type Props = {
  onLogin: () => void;
};

export default class PaginaLogin extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Aqui você pode simular verificação e "logar"
    this.props.onLogin();
  }

  render() {
    return (
      <div className="container mt-5" style={{ maxWidth: '500px' }}>
        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Digite seu e-mail" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input type="password" className="form-control" placeholder="Digite sua senha" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    );
  }
}
