using INF.CommApp.BLL.Interfaces;
using INF.CommApp.BLL.Providers;
using INF.CommApp.BLL.Services;
using Microsoft.Extensions.DependencyInjection;

namespace INF.CommApp.BLL.Extensions
{
    /// <summary>
    /// Extension methods for setting up notification services
    /// </summary>
    public static class NotificationServiceExtensions
    {
        /// <summary>
        /// Add notification services to dependency injection container
        /// </summary>
        public static IServiceCollection AddNotificationServices(this IServiceCollection services)
        {
            // Register user preferences service
            services.AddScoped<IUserNotificationPreferencesService, UserNotificationPreferencesService>();

            // Register the main notification service
            services.AddScoped<INotificationService, NotificationService>();

            // Register notification providers
            services.AddScoped<TwilioSmsProvider>();
            services.AddScoped<MauiPushProvider>();
            services.AddScoped<IvrProvider>();

            // Register a service that configures all providers
            services.AddScoped<INotificationServiceConfigurator, NotificationServiceConfigurator>();

            return services;
        }

        /// <summary>
        /// Add business services to dependency injection container
        /// </summary>
        public static IServiceCollection AddBusinessServices(this IServiceCollection services)
        {
            // Register business logic services
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IFacilityService, FacilityService>();
            services.AddScoped<IResidentService, ResidentService>();
            services.AddScoped<IAgencyService, AgencyService>();

            return services;
        }
    }

    /// <summary>
    /// Service to configure notification providers at startup
    /// </summary>
    public interface INotificationServiceConfigurator
    {
        public Task ConfigureProvidersAsync(INotificationService notificationService);
    }

    public class NotificationServiceConfigurator : INotificationServiceConfigurator
    {
        private readonly TwilioSmsProvider _twilioProvider;
        private readonly MauiPushProvider _pushProvider;
        private readonly IvrProvider _ivrProvider;

        public NotificationServiceConfigurator(
            TwilioSmsProvider twilioProvider,
            MauiPushProvider pushProvider,
            IvrProvider ivrProvider)
        {
            _twilioProvider = twilioProvider;
            _pushProvider = pushProvider;
            _ivrProvider = ivrProvider;
        }

        public Task ConfigureProvidersAsync(INotificationService notificationService)
        {
            // Register all providers (service will only register configured ones)
            notificationService.RegisterProvider(_twilioProvider);
            notificationService.RegisterProvider(_pushProvider);
            notificationService.RegisterProvider(_ivrProvider);

            return Task.CompletedTask;
        }
    }
}