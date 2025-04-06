import type React from 'react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  finishDelay?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ finishDelay = 1000 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем полную загрузку ресурсов
    window.onload = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, finishDelay);
    };

    // Если window.onload не сработал (ресурсы уже загружены)
    if (document.readyState === 'complete') {
      setTimeout(() => {
        setIsLoading(false);
      }, finishDelay);
    }

    return () => {
      window.onload = null;
    };
  }, [finishDelay]);

  // Красивые варианты анимации для элементов прелоадера
  const containerVariants = {
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    show: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-50"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeInOut",
              when: "afterChildren"
            }
          }}
        >
          <motion.div
            className="flex flex-col items-center justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Логотип или иконка */}
            <motion.div
              className="relative mb-8"
              variants={itemVariants}
            >
              <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-rose-400 flex items-center justify-center text-white text-xl font-semibold">
                  N<span className="text-sm">nails</span>
                </div>
              </div>
            </motion.div>

            {/* Текст загрузки */}
            <motion.div
              className="text-rose-900 text-lg font-medium mb-6"
              variants={itemVariants}
            >
              Загрузка сайта...
            </motion.div>

            {/* Индикатор прогресса */}
            <motion.div className="w-48 h-1 bg-rose-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-rose-500"
                variants={lineVariants}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
