import { createContext, useContext } from 'react';

/**
 * ClientConfigContext – provides client-specific configuration to components
 * that are deep in the tree (e.g. ContentLabelsDropdown, ProfileSelector).
 * Avoids prop-drilling through 4+ component levels.
 */
export const ClientConfigContext = createContext(null);

export const useClientConfig = () => useContext(ClientConfigContext);
