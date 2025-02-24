require("nvim-tree").setup({
    sort = {
        sorter = "case_sensitive",
    },
    view = {
        width = 30,
    },
    renderer = {
--        icons = {
--            webdev_colors = true,  -- Enable webdev icons for web-related files
--            git_placement = 'signcolumn',  -- Where to place git icons ('signcolumn' or 'column')
--            padding = ' ',  -- Padding for icons
--            show = {
--              file = true,  -- Show file icons
--              folder = true,  -- Show folder icons
--              folder_arrow = true,  -- Show arrow for open folders
--              git = true,  -- Show git icons
--            },
--            glyphs = {
--              default = "",  -- Default file icon
--              symlink = "",  -- Symbolic link icon
--              folder = {
--                arrow_open = "",  -- Icon when a folder is opened
--                arrow_closed = "",  -- Icon when a folder is closed
--                default = "",  -- Default folder icon
--                open = "",  -- Open folder icon
--            },
--            git = {
--              unstaged = "✗",  -- Unstaged git file
--              staged = "✓",  -- Staged git file
--              unmerged = "",  -- Unmerged git file
--              renamed = "➜",  -- Renamed git file
--              untracked = "★",  -- Untracked git file
--              ignored = "◌",  -- Ignored git file
--            },
--            lsp = {
--              hint = "",  -- LSP hint
--              information = "",  -- LSP information
--              warning = "",  -- LSP warning
--              error = "",  -- LSP error
--            },
--        },
        group_empty = true,
    },
    filters = {
        dotfiles = true,
    },
--    on_attach = function(bufnr)
--        local api = require'nvim-tree.api.'
--        local function map_keys(mode,lhs,rhs,opts)
--            opts = opts or {}
--            vim.api.nvim_buf_set_keymap(bufnr,mode,lhs,rhs,opts)
--        end
--        map_keys('n', 'n', ':lua require"nvim-tree".api.tree.change_root_to_parent()<CR>', { noremap = true, silent = true })
--        map_keys('n', 'u', ':lua require"nvim-tree".api.node.navigate.up()<CR>', { noremap = true, silent = true })
--        map_keys('n', 'e', ':lua require"nvim-tree".api.node.navigate.down()<CR>', { noremap = true, silent = true })
--        map_keys('n', 'i', ':lua require"nvim-tree".api.node.open({ edit = false })<CR>', { noremap = true, silent = true })
--        map_keys('n', 'o', ':lua require"nvim-tree".api.node.open({ edit = true })<CR>', { noremap = true, silent = true })
--        map_keys('n', 'h', ':lua require"nvim-tree".api.node.close()<CR>', { noremap = true, silent = true })
--    end,

})
