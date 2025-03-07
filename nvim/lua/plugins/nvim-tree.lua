require("nvim-tree").setup({
      view = {
        width = 30, -- 设置文件树宽度
        side = "left", -- 在左侧显示
        number = false, -- 关闭行号
        relativenumber = false,
      },
      renderer = {
        icons = {
          show = {
            git = true, -- 显示 Git 状态
            folder = true,
            file = true,
          },
        },
        highlight_git = true, -- 高亮 Git 状态
        highlight_opened_files = "name", -- 高亮已打开的文件
      },
      actions = {
        open_file = {
          quit_on_open = true, -- 打开文件后自动关闭 nvim-tree
        },
      },
      git = {
        enable = true,
        ignore = false, -- 显示 .gitignore 里的文件
      },
      diagnostics = {
        enable = true, -- 显示 LSP 诊断信息
        show_on_dirs = true,
      },
    })
