require("toggleterm").setup({
      size = 20, -- 终端高度
      open_mapping = [[<C-\>]], -- 快捷键打开/关闭终端
      shade_filetypes = {},
      shade_terminals = true,
      shading_factor = 2,
      start_in_insert = true,
      persist_size = true,
      direction = "float", -- 终端类型: "vertical" | "horizontal" | "tab" | "float"
      close_on_exit = true,
      shell = vim.o.shell, -- 使用默认 shell
    })

