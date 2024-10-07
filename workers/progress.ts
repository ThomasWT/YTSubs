export function progress(duration: number) {
    const startTime = Date.now();
    const estimatedSeconds = Math.round(duration * (84 / 76));

    const intervalId = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const progressPercentage = Math.min((elapsedTime / estimatedSeconds) * 100, 100);
      
      return {
        elapsedTime,
        progressPercentage,
        estimatedProcessingTime: formatTime(estimatedSeconds),
      };
    }, 1000);

    return () => clearInterval(intervalId);
  }

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
}