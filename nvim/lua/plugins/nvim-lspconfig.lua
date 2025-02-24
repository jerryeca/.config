require("mason").setup()
require("mason-lspconfig").setup({
    ensure_installed = { "clangd", "rust_analyzer", "bashls","lua_ls","pyright" }, -- 自动安装
})
-- Lsp 服务器
local lspconfig = require("lspconfig")
-- python
lspconfig.pyright.setup({})
-- lua
lspconfig.lua_ls.setup({
    settings = {
        Lua = {
            diagnostics = {
                globals = { "vim" },
            },
        },
   },
})

-- C++:Clangd
lspconfig.clangd.setup({})

-- Rust:rust_analyzer
lspconfig.rust_analyzer.setup({
    settings = {
        ["rust-analyzer"] = {
            cargo = { allFeatures = true },
            checkOnSave = { command = "clippy" },
        },
    },
})

-- Shell: bash-language-server
lspconfig.bashls.setup({})
