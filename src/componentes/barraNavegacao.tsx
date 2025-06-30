/* eslint-disable jsx-a11y/anchor-is-valid */
import { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

type props = {
    tema: string;
    botoes: string[];
    seletorView: Function;
    logado: boolean; // nova prop
};

export default class BarraNavegacao extends Component<props> {
    constructor(props: props | Readonly<props>) {
        super(props);
        this.gerarListaBotoes = this.gerarListaBotoes.bind(this);
    }

    gerarListaBotoes() {
        if (this.props.botoes.length <= 0) {
            return <></>;
        } else {
            return this.props.botoes.map((valor) => (
                <li key={valor} className="nav-item">
                    <a className="nav-link" href="#" onClick={(e) => this.props.seletorView(valor, e)}>
                        {valor}
                    </a>
                </li>
            ));
        }
    }

    render() {
        const tema = this.props.tema;

        return (
            <nav className="navbar navbar-expand-lg" data-bs-theme="light" style={{ backgroundColor: tema, marginBottom: 10 }}>
                <div className="container-fluid">
                    <a
                        href="#"
                        className="navbar-brand mb-0 h1"
                        onClick={(e) => this.props.seletorView('Home', e)}
                    >
                        PetLovers
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">{this.gerarListaBotoes()}</ul>
                    </div>

                    <div className="d-flex align-items-center">
                        {this.props.logado ? (
                            <>
                                <div className="text-end me-3">
                                    <p className="mb-0 fw-medium text-dark" style={{ fontSize: "14px" }}>Administrador</p>
                                    <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>Loja Pet Center</p>
                                </div>
                                <div
                                    className="rounded-circle"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                                    }}
                                ></div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={(e) => this.props.seletorView('Login', e)}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={(e) => this.props.seletorView('Cadastro', e)}
                                >
                                    Cadastro
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        );
    }
}
