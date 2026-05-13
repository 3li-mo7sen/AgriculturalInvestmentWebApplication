namespace BackendAPI.Models
{
    public class UserChatPreference
    {
        public int Id { get; set; }   // optional but recommended
        public int UserId { get; set; }
        public User User { get; set; }   // navigation property (optional but good)
        public bool SaveHistory { get; set; }

        
    }
}
