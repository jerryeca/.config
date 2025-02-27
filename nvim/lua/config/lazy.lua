local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", -- latest stable release
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
{
    "ellisonleao/gruvbox.nvim",
    priority = 1000, -- Load Gruvbox before other plugins for proper theming
    config = function()
    require('plugins.gruvbox') -- Load configuration for Gruvbox
    end,
},
{
    "github/copilot.vim",
    cofig = function()
        require('plugins.copilot')
    end,
},
{
    "L3MON4D3/LuaSnip",
     dependencies = { "rafamadriz/friendly-snippets" },
     config = function()
        require("luasnip.loaders.from_vscode").lazy_load()  -- 加载 VSCode 格式的片段
     end,
},
{
    "nvim-telescope/telescope.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
        require('plugins.nvim-telescope')
    end,
},
{
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
        require('plugins.nvim-treesitter')
    end,
},
{
    "nvim-lualine/lualine.nvim",
    config = function()
        require("lualine").setup()
    end,
},
{
    "lewis6991/gitsigns.nvim",
    config = function()
        require("gitsigns").setup()
    end,
},
{
    "hrsh7th/nvim-cmp",
    dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        "hrsh7th/cmp-buffer",
        "hrsh7th/cmp-path",
        "hrsh7th/cmp-cmdline",
        "L3MON4D3/LuaSnip",
        "saadparwaiz1/cmp_luasnip",
    },
    config = function()
        require('plugins.nvim-cmp')
    end,
},
{
    "neovim/nvim-lspconfig",
    dependencies = {
        "williamboman/mason.nvim",
        "williamboman/mason-lspconfig.nvim",
    },
    config = function()
        require('plugins.nvim-lspconfig')
    end,
},
{
    "windwp/nvim-autopairs",
    config = function()
        require("nvim-autopairs").setup({})
    end,
},
{
    "numToStr/Comment.nvim",
    config = function()
        require('Comment').setup()
    end,
},
{
    'nvim-tree/nvim-tree.lua',
    config = function()
        require('plugins.nvim-tree')
    end,
},
{   "NvChad/nvterm",
    config = function()
        require("plugins.nvterm")
    end,
},
{
    "sainnhe/everforest",
    opts= { 
        style = "storm", --themes
        transparent = true, --透明
    },
}
})

