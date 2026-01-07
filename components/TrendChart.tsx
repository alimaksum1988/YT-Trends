
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendData } from '../types';

interface Props {
  data: TrendData[];
}

const TrendChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f3f4" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fill: '#70757a'}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 11, fill: '#70757a'}}
            domain={[0, 100]}
            dx={-10}
          />
          <Tooltip 
            cursor={{ stroke: '#dadce0', strokeWidth: 1 }}
            contentStyle={{ 
              borderRadius: '4px', 
              border: 'none', 
              boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="interest" 
            stroke="#4285f4" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#4285f4', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
