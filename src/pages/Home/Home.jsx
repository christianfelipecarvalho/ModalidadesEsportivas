import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import './Home.css';

const Home = () => {
  const theme = localStorage.getItem('theme');

  const dataPie = [
    { name: 'Basket', value: 50 },
    { name: 'Volei', value: 150 },
    { name: 'Futsal', value: 129 },
    { name: 'Handeibol', value: 138 },
  ];

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'];

  const dataBar = [
    { name: 'Ativo', value: 500 },
    { name: 'Inativo', value: 200 },
  ];

  return (
    <div className='home-geresports'>
      <div className='grafico-pizza'>
        <h2>Quantidade de Atletas por Modalidade</h2>
        <PieChart width={300} height={300}>
          <Pie
            data={dataPie}
            cx={'50%'}
            cy={'50%'}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {
              dataPie.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
        <div className='grafico'>
        <h2>Quantidade de Usuários Ativos e Inativos</h2>
        <BarChart
          width={500}
          height={300}
          data={dataBar}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Home;
