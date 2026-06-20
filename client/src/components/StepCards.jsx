// import React from 'react';
// import { motion } from 'framer-motion';

// const StepCards = ({ step, index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9, y: 30 }}
//       whileInView={{ opacity: 1, scale: 1, y: 0 }}
//       viewport={{ once: true, margin: "-50px" }}
//       transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
//       className="group relative"
//     >
//       <div className="flex flex-col items-center">
        
//         {/* Step Visual Indicator */}
//         <div className="mb-10 relative">
//           <div className="absolute inset-[-20px] bg-dodgerblue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
//           <div className="relative z-10 w-28 h-28 flex items-center justify-center">
//             <motion.div 
//               className="absolute inset-0 border-[3px] border-dashed border-dodgerblue-200 rounded-[2.5rem]" 
//               animate={{ rotate: 360 }}
//               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//             />
            
//             <div className="w-20 h-20 glass-morphism rounded-3xl shadow-[0_20px_40px_-15px_rgba(30,144,255,0.3)] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-3 group-hover:bg-white group-hover:shadow-[0_25px_50px_-12px_rgba(30,144,255,0.4)]">
//               <div className="text-dodgerblue-500 transition-all duration-500 transform group-hover:scale-110">
//                 {step.icon}
//               </div>
//             </div>

//             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg border border-white/10 whitespace-nowrap z-20 transition-all duration-500 group-hover:bg-dodgerblue-600 group-hover:-translate-y-4">
//               Phase {index + 1}
//             </div>
//           </div>
//         </div>

//         {/* Textual Content */}
//         <div className="text-center px-4 relative">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ delay: index * 0.2 + 0.4 }}
//           >
//             <span className="inline-block text-dodgerblue-500 text-[10px] font-extrabold uppercase tracking-[0.25em] mb-4 opacity-70 group-hover:opacity-100 transition-all duration-300">
//               {step.tag}
//             </span>
//             <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-dodgerblue-600 transition-colors">
//               {step.title}
//             </h3>
//             <p className="text-slate-500 text-sm leading-relaxed font-medium transition-colors group-hover:text-slate-600">
//               {step.description}
//             </p>
//           </motion.div>
//         </div>

//         <div className="lg:hidden mt-12 mb-4 w-[2px] h-16 bg-gradient-to-b from-dodgerblue-500/40 to-transparent last:hidden" />
//       </div>

//       <div className="absolute inset-x-[-20px] inset-y-[-30px] rounded-[3rem] -z-10 opacity-0 group-hover:opacity-100 bg-slate-50/50 transition-all duration-500 border border-slate-100" />
//     </motion.div>
//   );
// };

// export default StepCards;

import React from 'react'

const StepCards = () => {
  return (
    <div>
      
    </div>
  )
}

export default StepCards
