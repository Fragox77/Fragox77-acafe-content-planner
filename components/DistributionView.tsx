
import React from 'react';

interface DistributionViewProps {
  metrics: {
    porTema: { [key: string]: number };
  };
}

const DistributionView: React.FC<DistributionViewProps> = ({ metrics }) => {
  const { porTema } = metrics;
  // FIX: The 'count' in reduce can be inferred as 'unknown'. Coercing to Number for the sum operation.
  const totalPublicaciones = Object.values(porTema).reduce((sum, count) => sum + Number(count), 0);

  const colors = [
    'from-red-500 to-red-400', 'from-orange-500 to-orange-400', 'from-amber-500 to-amber-400',
    'from-yellow-500 to-yellow-400', 'from-lime-500 to-lime-400', 'from-green-500 to-green-400',
    'from-emerald-500 to-emerald-400', 'from-teal-500 to-teal-400', 'from-cyan-500 to-cyan-400',
    'from-sky-500 to-sky-400', 'from-blue-500 to-blue-400', 'from-indigo-500 to-indigo-400',
  ];

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Distribución por Temas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(porTema).map(([tema, count], index) => {
          // FIX: The 'count' can be inferred as 'unknown'. Coercing to Number for arithmetic and comparison operations.
          const percentage = totalPublicaciones > 0 ? (Number(count) / totalPublicaciones) * 100 : 0;
          return (
            <div key={tema} className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg shadow">
              <h4 className="font-semibold text-amber-900 mb-2 truncate">{tema}</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-amber-800 text-sm">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistributionView;
