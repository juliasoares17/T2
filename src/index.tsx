import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import BarraNavegacao from './componentes/barraNavegacao';
import PaginaClientes from './paginas/clientes';
import PaginaPets from './paginas/pets';
import PaginaProdutos from './paginas/produtos';
import PaginaServicos from './paginas/servicos';
import PaginaLogin from './paginas/login';
import PaginaCadastro from './paginas/cadastro';

type Cliente = {
  nome: string;
  nomeSocial: string;
  cpf: string;
  dataEmissao: string;
  rgs: string[];
  telefones: string[];
  dataCadastro: string;
};

type Servico = {
  nome: string;
  preco: number;
  duracao: number;
  codigo: string;
};

type Produto = {
  nome: string;
  preco: number;
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

type State = {
  tela: string;
  logado: boolean;
  produtos: Produto[];
  servicos: Servico[]; 
  pets: Pet[];
  clientes: Cliente[];
  consumos: Consumo[];
};

class App extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tela: 'Home',
      logado: false,
      produtos: [],
      servicos: [],
      pets: [],
      clientes: [],
      consumos: [],
    };
    this.selecionarView = this.selecionarView.bind(this);
  }

  selecionarView(novaTela: string, evento: React.MouseEvent<any>) {
    evento.preventDefault();
    this.setState({ tela: novaTela });
  }

  salvarCliente = (cliente: Cliente, indice: number | null) => {
    const clientes = [...this.state.clientes];
    if (indice !== null) {
      clientes[indice] = cliente;
    } else {
      clientes.push(cliente);
    }
    this.setState({ clientes });
  };

  excluirCliente = (indice: number) => {
    const clientes = [...this.state.clientes];
    clientes.splice(indice, 1);
    this.setState({ clientes });
  };


  adicionarOuEditarProduto = (produto: Produto, indice: number | null) => {
    const produtos = [...this.state.produtos];
    if (indice !== null) {
      produtos[indice] = produto;
    } else {
      produtos.push(produto);
    }
    this.setState({ produtos });
  };

  removerProduto = (indice: number) => {
    const produtos = [...this.state.produtos];
    produtos.splice(indice, 1);
    this.setState({ produtos });
  };

  salvarServico = (servico: Servico, indice: number | null) => {
    const { servicos } = this.state;
    if (indice !== null) {
      const atualizados = [...servicos];
      atualizados[indice] = servico;
      this.setState({ servicos: atualizados });
    } else {
      this.setState({ servicos: [...servicos, servico] });
    }
  };

  excluirServico = (indice: number) => {
    const { servicos } = this.state;
    const atualizados = [...servicos];
    atualizados.splice(indice, 1);
    this.setState({ servicos: atualizados });
  };

  salvarPet = (pet: Pet, indice: number | null) => {
    const pets = [...this.state.pets];
    if (indice !== null) {
      pets[indice] = pet;
    } else {
      pets.push(pet);
    }
    this.setState({ pets });
  };

  excluirPet = (id: number) => {
    const pets = this.state.pets.filter(p => p.id !== id);
    this.setState({ pets });
  };

  onRegistrarConsumo = (consumo: Consumo) => {
    this.setState((prevState) => ({
      consumos: [...prevState.consumos, consumo],
    }));
  };


  render() {
    const barraNavegacao = (
      <BarraNavegacao
        seletorView={this.selecionarView}
        tema="#e3f2fd"
        botoes={['Clientes', 'Pets', 'Produtos', 'Serviços']}
        logado={this.state.logado}
      />
    );

    let conteudo;
    switch (this.state.tela) {
      case 'Home':
        conteudo = (
          <div className="container mt-5 pt-5">
            <h2 className="text-center">🐾 Bem-vindo ao PetLovers!</h2>
            <p className="text-center mb-4">O sistema ideal para administrar seu negócio pet com facilidade e organização.</p>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mt-3">
              <div className="col">
                <div className="card h-100 shadow-sm d-flex flex-column">
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title">Clientes</h5>
                    <p className="card-text">Gerencie cadastros, edite informações e visualize o histórico de consumo de clientes.</p>
                    <div className="mt-auto">
                    <button className="btn btn-primary" onClick={(e) => this.selecionarView('Clientes', e)}>Acessar</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col">
                <div className="card h-100 shadow-sm d-flex flex-column">
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title">Pets</h5>
                    <p className="card-text">Cadastre pets, vincule aos seus donos e registre características detalhadas.</p>
                    <div className="mt-auto">
                    <button className="btn btn-primary" onClick={(e) => this.selecionarView('Pets', e)}>Acessar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 shadow-sm d-flex flex-column">
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title">Produtos</h5>
                    <p className="card-text">Gerencie os produtos vendidos, estoques, tipos e consumo por cliente ou pet.</p>
                    <div className="mt-auto">
                    <button className="btn btn-primary" onClick={(e) => this.selecionarView('Produtos', e)}>Acessar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 shadow-sm d-flex flex-column">
                  <div className="card-body d-flex flex-column text-center">
                    <h5 className="card-title">Serviços</h5>
                    <p className="card-text">Controle os serviços prestados, registros por pet e relatórios por tipo e raça.</p>
                    <div className="mt-auto">
                    <button className="btn btn-primary" onClick={(e) => this.selecionarView('Serviços', e)}>Acessar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case 'Clientes':
      conteudo = (
        <PaginaClientes
          clientes={this.state.clientes}
          pets={this.state.pets}
          consumos={this.state.consumos}
          produtos={this.state.produtos}
          serv={this.state.servicos} 
          onSalvar={this.salvarCliente}
          onExcluir={this.excluirCliente}
          onRegistrarConsumo={this.onRegistrarConsumo}
        />

      );
      break;
      case 'Pets':
        conteudo = (
          <PaginaPets
            pets={this.state.pets}
            onSalvar={this.salvarPet}
            onExcluir={this.excluirPet}
          />
        );
        break;
      case 'Produtos':
        conteudo = (
          <PaginaProdutos
            produtos={this.state.produtos}
            consumos={this.state.consumos}
            pets={this.state.pets} 
            onSalvar={this.adicionarOuEditarProduto}
            onExcluir={this.removerProduto}
          />
        );
        break;
      case 'Serviços':
        conteudo = (
          <PaginaServicos
            servicos={this.state.servicos}
            consumos={this.state.consumos}
            pets={this.state.pets}
            onSalvar={this.salvarServico}
            onExcluir={this.excluirServico}
          />
        );
        break;
      case 'Login':
        conteudo = <PaginaLogin onLogin={() => this.setState({ logado: true, tela: 'Home' })} />;
        break;
      case 'Cadastro':
        conteudo = <PaginaCadastro onCadastroConcluido={() => this.setState({ tela: 'Login' })} />;
        break;
      default:
        conteudo = <p className="text-center">Tela não encontrada :(</p>;
    }

    return (
      <>
        {barraNavegacao}
        {conteudo}
      </>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

