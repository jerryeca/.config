local alpha = require("alpha")
local dashboard = require ("alpha.themes.dashboard")

--custom ASCII Art for "Neovim"
dashboard.section.header.val = {
  [[ ███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗███╗   ███╗ ]],
  [[ ████╗  ██║██╔════╝██╔═══██╗██║   ██║██║████╗ ████║ ]],
  [[ ██╔██╗ ██║█████╗  ██║   ██║██║   ██║██║██╔████╔██║ ]],
  [[ ██║╚██╗██║██╔══╝  ██║   ██║██║   ██║██║██║╚██╔╝██║ ]],
  [[ ██║ ╚████║███████╗╚██████╔╝╚██████╔╝██║██║ ╚═╝ ██║ ]],
  [[ ╚═╝  ╚═══╝╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝     ╚═╝ ]],
}

-- Set menu buttons
dashboard.section.buttons.val = {
  dashboard.button("f", "  Find File", ":Telescope find_files<CR>"),
  dashboard.button("n", "  New File", ":ene <BAR> startinsert<CR>"),
  dashboard.button("r", "  Recent Files", ":Telescope oldfiles<CR>"),
  dashboard.button("g", "  Find Text", ":Telescope live_grep<CR>"),
  dashboard.button("c", "  Config", ":e $MYNEOVIM<CR>"),
  dashboard.button("q", "  Quit", ":qa<CR>"),
}
-- Set footer text
dashboard.section.footer.val = {
  "🚀 Neovim loaded successfully!",
  "📂 " .. vim.fn.getcwd(),
}
-- Apply theme
alpha.setup(dashboard.config)
