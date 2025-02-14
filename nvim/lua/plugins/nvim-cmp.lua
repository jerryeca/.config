local cmp = require("cmp")
cmp.setup({
    snippet = {
    expand = function(args)
        vim.fn["vsnip#anonymous"](args.body)
    end,
    },
    mapping = cmp.mapping.preset.insert({
    ['<C-b>'] = cmp.mapping.scroll_docs(-4),
    ['<C-f>'] = cmp.mapping.scroll_docs(4),
    ['<C-Space>'] = cmp.mapping.complete(),
    ['<C-e>'] = cmp.mapping.abort(),
    ['<Tab>'] = cmp.mapping.confirm({ select = true }),
    ['<S-Tab>'] = cmp.mapping(function(fallback)
        if cmp.visible() then
            cmp.select_next_item()
        else
            fallback()
        end
    end,{'i','s'}),
    }),
    sources = cmp.config.sources({
    { name = 'nvim_lsp' },
    { name = 'vsnip' },
    }, {
    { name = 'buffer' },
    }),
    cmp.setup.cmdline(":", {
      mapping = cmp.mapping.preset.cmdline(),
      sources = cmp.config.sources({
        { name = "path" },
       }, {
        { name = "cmdline" },
      }),
    }),
})
