using System.Threading.Tasks;

namespace CS.MintAndRefund.Interfaces
{
    public interface IRefund
    {
        public Task RefundFromInvalidDBTransaction();
    }
}