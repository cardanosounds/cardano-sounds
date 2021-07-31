using System.Threading.Tasks;

namespace CS.MintAndRefund.Interfaces
{
    public interface IMint
    {
        public Task MintFromDbTransaction();
    }
}