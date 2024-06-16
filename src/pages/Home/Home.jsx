import { Card } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CollapsedContext } from '../../contexts/CollapsedContext';
import { ListarAtletasGeneroFeminino, ListarAtletasMediaIdade, ListarMediasPorcentagens, atletasPorModalidade } from '../../services/HomeService';
import './Home.css';

const Home = () => {
  const theme = localStorage.getItem('theme');
  const { collapsed } = useContext(CollapsedContext);
  const [dataPie, setDataPie] = useState([]);
  const [dataIdade, setDataIdade] = useState([]);
  // const [dataMulheres, setDataMulheres] = useState([]);
  const [totalAtletas, setTotalAtletas] = useState([]);
  const [porcentagemMulheres, setPorcentagemMulheres] = useState([]);
  const [porcentagemHomens, setPorcentagemHomens] = useState([]);
  const [idadeMedia, setIdadeMedia] = useState([]);
  const [dataMulheres, setDataMulheres] = useState([]);

  useEffect(() => {
    atletasPorModalidade().then(response => {
      const mappedData = response.data.map(item => ({
        name: item.nomeModalidade,
        value: item.quantidadeAtletas
      }));
      setDataPie(mappedData);
    });
  }, []);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'];

  // const dataBar = [
  //   { name: 'Ativo', value: 500 },
  //   { name: 'Inativo', value: 200 },
  // ];
  useEffect(() => {
    ListarAtletasMediaIdade().then(response => {
      const mappedData = response.data.map(item => ({
        name: item.modalidade,
        value: item.mediaIdade
      }));
      setDataIdade(mappedData);
    });
  }, []);

  // useEffect(() => {
  //   ListarAtletasGeneroFeminino().then(response => {
  //     const mappedData = response.data.map(item => ({
  //       name: item.modalidade,
  //       value: item.mediaIdade
  //     }));
  //     setDataIdade(mappedData);
  //   });
  // }, []);

  // const dataMulheres = [
  //   { name: 'Basket', SUB20: 30, SUB17: 20 },
  //   { name: 'Volei', SUB20: 40, SUB17: 10 },
  //   { name: 'Futsal', SUB20: 20, SUB17: 30 },
  //   { name: 'Handeibol', SUB20: 25, SUB17: 15 },
  // ];
  useEffect(() => {
    ListarMediasPorcentagens().then(response => {
      setTotalAtletas(response.data.totalAtletas);
      setIdadeMedia(response.data.mediaIdade);
      setPorcentagemMulheres(response.data.porcentagemMulheres);
      setPorcentagemHomens(response.data.porcentagemHomens);
    });
  }, []);


  useEffect(() => {
  ListarAtletasGeneroFeminino().then(response => {
    const todasCategorias = new Set();
    const transformedData = response.data.map(item => {
      const transformedItem = { name: item.modalidade };

      item.categoria.forEach(cat => {
        const [categoria, valor] = cat.split(', ');
        transformedItem[categoria] = Number(valor);
        todasCategorias.add(categoria);
      });

      return transformedItem;
    });

    transformedData.forEach(item => {
      todasCategorias.forEach(cat => {
        if (!(cat in item)) {
          item[cat] = 0;
        }
      });
    });

    // Atualize o estado com os dados transformados
    setDataMulheres(transformedData);
  });
}, []);




  return (
    <div className='home-geresports' style={{ marginLeft: collapsed ? '30px' : '11%' }}>
      <div className='dashboard'>
        <div className='resumos-div'>
          <Card title="Médias" className='resumo'>
            <div className='numeros-grandes'>
              <h1>{totalAtletas}</h1>
              <p>Total de Atletas</p>
            </div>
            <div className='numeros-grandes'>
              <h1>{idadeMedia}</h1>
              <p>Idade Média</p>
            </div>
          </Card>
          <Card title="Porcentagens" className='resumo'>
            <div className='numeros-grandes'>
              <h1>{porcentagemHomens}%</h1>
              <p>Atletas Homens</p>
            </div>
            <div className='numeros-grandes'>
              <h1>{porcentagemMulheres}%</h1>
              <p>Atletas Mulheres</p>
            </div>
          </Card>
          <Card title="Atletas por Modalidade" className='grafico-pizza'>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dataPie}
                  cx={'50%'}
                  cy={'50%'}
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {
                    dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className='grafico-3' >
          {/* <div className='grafico' >
            <Card title="Usuários Ativos e Inativos" className='card-grafico' style={{ marginBottom: '20px' }}>
              <ResponsiveContainer width="60%" height={250}>
                <BarChart data={dataBar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#FF6384" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div> */}
          <div className='grafico-2' >
            <Card title="Atletas do Sexo Feminino por Categoria e Modalidade" style={{ marginBottom: '20px' }}>
              <ResponsiveContainer width="60%" height={250}>
                <BarChart data={dataMulheres}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {
                    // Crie as barras de forma dinâmica
                    Object.keys(dataMulheres[0] || {}).map((key, index) => {
                      if (key !== 'name') {
                        return <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />;
                      }
                      return null;
                    })
                  }
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className='grafico-media-idade' >
            <Card title="Idade Média por Modalidade" style={{ marginBottom: '20px' }}>
              <ResponsiveContainer width="60%" height={250}>
                <BarChart data={dataIdade}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
