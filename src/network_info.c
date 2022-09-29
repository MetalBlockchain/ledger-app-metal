#include "network_info.h"

const network_info_t const network_info[NETWORK_INFO_SIZE] =
{
  { .network_id = NETWORK_ID_MAINNET,
    // UQg9hfKuviMwwkR16hE8nHyrmG6f5tax5seEoqUSiBmsTghXE
    .x_blockchain_id = { 0x3e, 0x3b, 0xd0, 0x53, 0x70, 0x15, 0xdb, 0xf5, 0x81, 0x8e, 0x62, 0xb9, 0x8a, 0x7c, 0x12, 0xe0, 0x78, 0x72, 0x79, 0xa7, 0xe6, 0x41, 0xbc, 0xa5, 0x55, 0xef, 0x2e, 0x60, 0x8f, 0xc5, 0xb4, 0xc6 },
    // 28fJD1hMz2PSRJKJt7YT41urTPR37rUNUcdeJ8daoiwP6DGnAR
    .c_blockchain_id = { 0x95, 0x16, 0xf7, 0x92, 0x9d, 0x70, 0xc4, 0x5d, 0x32, 0xfe, 0x10, 0x31, 0xe1, 0xf9, 0xa1, 0x80, 0x77, 0xa8, 0x77, 0x5c, 0x6, 0x60, 0x83, 0xaf, 0xf3, 0xc1, 0x12, 0xf2, 0x32, 0x80, 0xab, 0xf8 },
    // 2pjq58dnYTfrUJvvnC1uHDBP87DyP2oJj9uTmt3vdJg9Nhr9d4
    .avax_asset_id = { 0xf0, 0x17, 0x8f, 0xa6, 0xd6, 0xdf, 0x7, 0x48, 0x8f, 0xdf, 0xa8, 0xdb, 0x19, 0xeb, 0x6a, 0x2d, 0x19, 0xc9, 0x1e, 0x38, 0xec, 0x32, 0xb6, 0xd8, 0xda, 0xe5, 0x6f, 0xc6, 0xe5, 0xb8, 0x0, 0xeb },
    .hrp = "metal",
    .network_name = "mainnet",
  },
  { .network_id = NETWORK_ID_TAHOE,
    // N8BzztcRDHj6nNcGLbdimm6FSwE34rSVSgxhcV18TAaYSa4Q8
    .x_blockchain_id = { 0x2f, 0xf6, 0xeb, 0xb9, 0x8, 0x5, 0xf0, 0x4, 0x22, 0xfb, 0x3, 0x21, 0x25, 0x1b, 0x31, 0xc, 0x33, 0xd6, 0xdf, 0xbd, 0x2f, 0x37, 0xc8, 0x44, 0x38, 0x70, 0x3e, 0xca, 0x17, 0x95, 0x9b, 0x3f },
    // t34kbq3fgdNaurCHn4aJpayuE46vh5AozKPZZG6MrjE2F7XP6
    .c_blockchain_id = { 0x73, 0xe1, 0xf0, 0x4, 0xb3, 0xfa, 0x99, 0x3c, 0x61, 0x9d, 0xd, 0x97, 0xfc, 0x82, 0x73, 0x6c, 0xf9, 0x34, 0x9f, 0xb1, 0x70, 0xd8, 0xd2, 0x45, 0x15, 0x40, 0x48, 0xa5, 0xe6, 0x8e, 0x4b, 0x1a },
    // 2QpCJwPk3nzi1VqJEuaFA44WM2UUzraBXQyH6jMGLTLQhqoe4n
    .avax_asset_id = { 0xb9, 0xc4, 0x9d, 0x95, 0x6f, 0x3b, 0x69, 0x8c, 0x55, 0x80, 0xd2, 0xe2, 0xef, 0xfb, 0x77, 0x50, 0xed, 0x5c, 0xb8, 0x1d, 0x92, 0x49, 0xef, 0x7, 0xc2, 0x9, 0x1, 0xf2, 0xef, 0xe5, 0x98, 0x71 },
    .hrp = "tahoe",
    .network_name = "tahoe",
  },
  { .network_id = NETWORK_ID_LOCAL,
    // 2eNy1mUFdmaxXNj1eQHUe7Np4gju9sJsEtWQ4MX3ToiNKuADed
    .x_blockchain_id = { 0xd8, 0x91, 0xad, 0x56, 0x05, 0x6d, 0x9c, 0x01, 0xf1, 0x8f, 0x43, 0xf5, 0x8b, 0x5c, 0x78, 0x4a, 0xd0, 0x7a, 0x4a, 0x49, 0xcf, 0x3d, 0x1f, 0x11, 0x62, 0x38, 0x04, 0xb5, 0xcb, 0xa2, 0xc6, 0xbf },
    // 2CA6j5zYzasynPsFeNoqWkmTCt3VScMvXUZHbfDJ8k3oGzAPtU
    .c_blockchain_id = { 0x9d, 0x07, 0x75, 0xf4, 0x50, 0x60, 0x4b, 0xd2, 0xfb, 0xc4, 0x9c, 0xe0, 0xc5, 0xc1, 0xc6, 0xdf, 0xeb, 0x2d, 0xc2, 0xac, 0xb8, 0xc9, 0x2c, 0x26, 0xee, 0xae, 0x6e, 0x6d, 0xf4, 0x50, 0x2b, 0x19 },
    // 2fombhL7aGPwj3KH4bfrmJwW6PVnMobf9Y2fn9GwxiAAJyFDbe
    .avax_asset_id = { 0xdb, 0xcf, 0x89, 0x0f, 0x77, 0xf4, 0x9b, 0x96, 0x85, 0x76, 0x48, 0xb7, 0x2b, 0x77, 0xf9, 0xf8, 0x29, 0x37, 0xf2, 0x8a, 0x68, 0x70, 0x4a, 0xf0, 0x5d, 0xa0, 0xdc, 0x12, 0xba, 0x53, 0xf2, 0xdb },
    .hrp = "local",
    .network_name = "local",
  },

};
