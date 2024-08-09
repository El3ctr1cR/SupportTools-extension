# Support Tools Extension

This Chrome extension is designed primarily for IT Support teams using the Autotask ticketing system. It provides automated handling of specific URLs and offers customizable Autotask email templates with variables.

## Features

### 1. Office URLs in Incognito Mode
- Automatically opens specified Office URLs (e.g., `portal.office.com`, `microsoft365.com`, `admin.microsoft.com`, `portal.azure.com`) in incognito mode.
- A bypass filter can be enabled to prevent this automatic behavior, allowing the URLs to open in the normal browsing mode.

### 2. Autotask Email Template Variables
- You can create custom email templates within Autotask using predefined variables for dynamic content.
- **List of available variables:**
  - `${loggedinUser}`: The name of the logged-in user.
  - `${ticketContact}`: The name of the ticket's contact person.
  - `${ticketPrimaryResource}`: The primary resource assigned to the ticket.
  - `${ticketLastActivityTime}`: The date and time of the last activity on the ticket.
  - `${ticketPriority}`: The priority level of the ticket.
  - `${ticketCurrentStatus}`: The current status of the ticket.
  - `${ticketNewStatus}`: The new status that has been set for the ticket.
  - `${currentTime}`: The current time.
  - `${currentDate}`: The current date.

### 3. Configuration Export and Import
- The extension allows you to export and import configuration settings, making it easy to transfer settings between different environments or users.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where this extension is located.
5. The extension is now installed and ready to use.

## License

This project is licensed under the GPL-3.0 license. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with improvements or new features.

## Contact

For any questions or support, please open an issue on this repository.
