import { useEffect } from 'react';

export const useClicker = (gameState, setGameState) => {
  const safeGameState = gameState ?? {
    clickValue: 1,
    clickMultiplier: 1,
    prestige: { bonusPercent: 0 },
    globalMultiplier: 1,
    canClick: true,
    critChance: 0
  };

  const handleClick = () => {
    if (!safeGameState.canClick) {
      console.log("⛔ Click not allowed");
      return;
    }

    const clickValue = safeGameState.clickValue > 0 ? safeGameState.clickValue : 1;
    const clickMultiplier = safeGameState.clickMultiplier ?? 1;
    const bonus = 1 + (safeGameState.prestige?.bonusPercent || 0) / 100;
    const global = safeGameState.globalMultiplier ?? 1;
    const isCrit = Math.random() < ((safeGameState?.critChance || 0) / 100);
    const multiplier = isCrit ? 5 : 1;

    const value = clickValue * clickMultiplier * bonus * global * multiplier;

    console.log("🟢 handleClick RUNNING");
    console.log("clickValue:", clickValue);
    console.log("clickMultiplier:", clickMultiplier);
    console.log("bonus:", bonus);
    console.log("global:", global);
    console.log("multiplier:", multiplier);
    console.log("==> value to add:", value);

    setGameState(prev => {
      if (!prev) return prev;

      const totalCreditsEarned = (prev.stats?.totalCreditsEarned || 0) + value;
      const totalClicks = (prev.stats?.totalClicks || 0) + 1;

      return {
        ...prev,
        credits: prev.credits + value,
        stats: {
          ...prev.stats,
          totalCreditsEarned,
          totalClicks
        }
      };
    });
  };

  const openCase = () => {
    setGameState(prev => {
      if (!prev) return prev;

      const totalCasesOpened = (prev.stats?.totalCasesOpened || 0) + 1;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalCasesOpened
        }
      };
    });
  };

  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;

        const clickValue = prev.clickValue > 0 ? prev.clickValue : 1;
        const multiplier = prev.clickMultiplier ?? 1;
        const autoClickers = prev.autoClickers ?? 0;
        const passive = prev.passiveIncome ?? 0;
        const global = prev.globalMultiplier ?? 1;

        const autoCredits = (autoClickers * clickValue * multiplier * global) / 2;
        const passiveCredits = passive * global;

        console.log("[AUTO]:", autoCredits.toFixed(2), "[PASSIVE]:", passiveCredits.toFixed(2));

        return {
          ...prev,
          credits: prev.credits + autoCredits + passiveCredits
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    gameState?.autoClickers,
    gameState?.passiveIncome,
    gameState?.clickValue,
    gameState?.clickMultiplier,
    gameState?.globalMultiplier
  ]);

  return {
    handleClick,
    openCase
  };
};
