using Microsoft.Extensions.Logging;
using System;

namespace CS.TokenMint
{
    public class CliLogger : Csharp.CardanoCLI.ILogger
    {
        private readonly ILogger _logger;

        public CliLogger(ILogger logger)
        {
            _logger = logger;
        }

        public void Err(string message, Exception ex = null)
        {
            _logger.LogError(message, ex);
        }

        public void Log(string message)
        {
            _logger.LogInformation(message);
        }

        public void Warn(string message)
        {
            _logger.LogWarning(message);
        }
    }
}
