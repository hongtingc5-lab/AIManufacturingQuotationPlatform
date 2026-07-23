/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MARKETING_ORIGIN?: string
  readonly VITE_USER_ORIGIN?: string
  readonly VITE_ADMIN_ORIGIN?: string
  readonly VITE_MES_ORIGIN?: string
  readonly VITE_SUPPLIER_ORIGIN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
