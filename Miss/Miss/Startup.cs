using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Miss.Startup))]
namespace Miss
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
