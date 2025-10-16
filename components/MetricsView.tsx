
import React from 'react';

interface MetricsViewProps {
  metrics: {
    totalPublicaciones: number;
    porTipo: { [key: string]: number };
    porSemana: { [key: number]: number };
  };
}

const MetricsView: React.FC<MetricsViewProps> = ({ metrics }) => {
  const { totalPublicaciones, porTipo, porSemana } = metrics;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border border-[#ece1d4]">
        <h3 className="text-xl font-bold text-[#492b2b] mb-4">Por Tipo de Contenido</h3>
        {Object.entries(porTipo).map(([tipo, count]) => {
          // FIX: The 'count' variable might be inferred as 'unknown'. Coercing to a number before arithmetic operation.
          const percentage = totalPublicaciones > 0 ? (Number(count) / totalPublicaciones) * 100 : 0;
          return (
            <div key={tipo} className="mb-3">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-[#492b2b] font-medium">{tipo}</span>
                <span className="font-bold text-[#492b2b]">{count} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="h-2.5 bg-[#ece1d4] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#841f82] rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-[#ece1d4]">
        <h3 className="text-xl font-bold text-[#492b2b] mb-4">Publicaciones por Semana</h3>
        <div className="max-h-80 overflow-y-auto pr-2">
            {Object.entries(porSemana).map(([semana, count]) => {
            // FIX: Arguments for Math.max can be inferred as 'unknown'. Mapping values to Number ensures they are numbers.
            const maxPubsPerWeek = Math.max(...Object.values(porSemana).map(Number));
            // FIX: The 'count' variable might be inferred as 'unknown'. Coercing to a number before arithmetic operation.
            const percentage = maxPubsPerWeek > 0 ? (Number(count) / maxPubsPerWeek) * 100 : 0;
            return (
                <div key={semana} className="mb-3">
                <div className="flex justify-between mb-1 text-sm">
                    <span className="text-[#492b2b] font-medium">Semana {semana}</span>
                    <span className="font-bold text-[#492b2b]">{count} publicaciones</span>
                </div>
                <div className="h-2.5 bg-[#ece1d4] rounded-full overflow-hidden">
                    <div 
                    className="h-full bg-[#492b2b] rounded-full"
                    style={{ width: `${percentage}%` }}
                    />
                </div>
                </div>
            );
            })}
        </div>
      </div>
    </div>
  );
};

export default MetricsView;