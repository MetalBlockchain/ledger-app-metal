const fujiAssetId = [
  0x3d, 0x9b, 0xda, 0xc0, 0xed, 0x1d, 0x76, 0x13,
  0x30, 0xcf, 0x68, 0x0e, 0xfd, 0xeb, 0x1a, 0x42,
  0x15, 0x9e, 0xb3, 0x87, 0xd6, 0xd2, 0x95, 0x0c,
  0x96, 0xf7, 0xd2, 0x8f, 0x61, 0xbb, 0xe2, 0xaa,
];
const localAssetId = [
  0xdb, 0xcf, 0x89, 0x0f, 0x77, 0xf4, 0x9b, 0x96,
  0x85, 0x76, 0x48, 0xb7, 0x2b, 0x77, 0xf9, 0xf8,
  0x29, 0x37, 0xf2, 0x8a, 0x68, 0x70, 0x4a, 0xf0,
  0x5d, 0xa0, 0xdc, 0x12, 0xba, 0x53, 0xf2, 0xdb,
];

const finalizePrompt = {header: "Finalize", body: "Transaction"};

describe("P-chain import and export tests", () => {
  it('can sign a transaction importing to P-chain from X-chain', async function () {
    const txn = Buffer.from([
      // CodecID
      0x00, 0x00,
      // base tx:
      0x00, 0x00, 0x00, 0x11,
      0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,

      ... fujiAssetId,

      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x12, 0x30,
      0x9c, 0xd5, 0xfd, 0xc0, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0x3c, 0xb7, 0xd3, 0x84,
      0x2e, 0x8c, 0xee, 0x6a, 0x0e, 0xbd, 0x09, 0xf1,
      0xfe, 0x88, 0x4f, 0x68, 0x61, 0xe1, 0xb2, 0x9c,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // sourceChain
      // chain for fuji
      0xab, 0x68, 0xeb, 0x1e, 0xe1, 0x42, 0xa0, 0x5c,
      0xfe, 0x76, 0x8c, 0x36, 0xe1, 0x1f, 0x0b, 0x59,
      0x6d, 0xb5, 0xa3, 0xc6, 0xc7, 0x7a, 0xab, 0xe6,
      0x65, 0xda, 0xd9, 0xe6, 0x38, 0xca, 0x94, 0xf7,
      // input count:
      0x00, 0x00, 0x00, 0x01,
      // txID:
      0xf1, 0xe1, 0xd1, 0xc1, 0xb1, 0xa1, 0x91, 0x81,
      0x71, 0x61, 0x51, 0x41, 0x31, 0x21, 0x11, 0x01,
      0xf0, 0xe0, 0xd0, 0xc0, 0xb0, 0xa0, 0x90, 0x80,
      0x70, 0x60, 0x50, 0x40, 0x30, 0x20, 0x10, 0x00,
      // utxoIndex:
      0x00, 0x00, 0x00, 0x05,
      // assetID:
      ... fujiAssetId,

      // input:
      0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x20, 0x00,
      0xee, 0x6b, 0x28, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00,
    ]);
    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const signPrompt = {header:"Sign",body:"Import"};
    const importPrompt = {header:"P chain import",body:"19999.999 AVAX to fuji18jma8ppw3nhx5r4ap8clazz0dps7rv5u6wmu4t"};
    const feePrompt = {header:"Fee",body:"15188.373088832 AVAX"};
    const prompts = chunkPrompts([
      signPrompt, importPrompt, feePrompt
    ]).concat([[finalizePrompt]]);

    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign a transaction exporting to X-chain from P-chain', async function () {
    const txn = Buffer.from([
      0x00, 0x00,
      // base tx:
      0x00, 0x00, 0x00, 0x12,
      0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      ... fujiAssetId,
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x30, 0x39, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0xd4, 0x31, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01,
      0xc3, 0x34, 0x41, 0x28, 0xe0, 0x60, 0x12, 0x8e,
      0xde, 0x35, 0x23, 0xa2, 0x4a, 0x46, 0x1c, 0x89,
      0x43, 0xab, 0x08, 0x59, 0x00, 0x00, 0x00, 0x01,
      0xf1, 0xe1, 0xd1, 0xc1, 0xb1, 0xa1, 0x91, 0x81,
      0x71, 0x61, 0x51, 0x41, 0x31, 0x21, 0x11, 0x01,
      0xf0, 0xe0, 0xd0, 0xc0, 0xb0, 0xa0, 0x90, 0x80,
      0x70, 0x60, 0x50, 0x40, 0x30, 0x20, 0x10, 0x00,
      0x00, 0x00, 0x00, 0x05,
      ... fujiAssetId,
      0x00, 0x00, 0x00, 0x05,
      0x00, 0x00, 0x00, 0x00, 0x07, 0x5b, 0xcd, 0x15,
      0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x07,
      0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04,
      0x00, 0x01, 0x02, 0x03,
      // destination_chain:
      // use fuji, not p-chain.
      0xab, 0x68, 0xeb, 0x1e, 0xe1, 0x42, 0xa0, 0x5c,
      0xfe, 0x76, 0x8c, 0x36, 0xe1, 0x1f, 0x0b, 0x59,
      0x6d, 0xb5, 0xa3, 0xc6, 0xc7, 0x7a, 0xab, 0xe6,
      0x65, 0xda, 0xd9, 0xe6, 0x38, 0xca, 0x94, 0xf7,
      // outs[] count:
      0x00, 0x00, 0x00, 0x01,
      // assetID:
      ... fujiAssetId,
      // output:
      0x00, 0x00, 0x00, 0x07,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x39,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd4, 0x31,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x51, 0x02, 0x5c, 0x61, 0xfb, 0xcf, 0xc0, 0x78,
      0xf6, 0x93, 0x34, 0xf8, 0x34, 0xbe, 0x6d, 0xd2,
      0x6d, 0x55, 0xa9, 0x55,
    ]);
    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const signPrompt = {header:"Sign",body:"Export"};
    const transferPrompt = {header:"Transfer",body:'0.000012345 AVAX to fuji1cv6yz28qvqfgah34yw3y53su39p6kzzehw5pj3'};
    const exportPrompt = {header:"P chain export",body:'0.000012345 AVAX to fuji12yp9cc0melq83a5nxnurf0nd6fk4t224unmnwx'};
    const feePrompt = {header:"Fee",body:"0.123432099 AVAX"};
    const prompts = chunkPrompts([
      signPrompt, transferPrompt, exportPrompt, feePrompt
    ]).concat([[finalizePrompt]]);

    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign a transaction exporting to C-chain from P-chain', async function() {
    // Collected from avalanchejs examples:
    const txn = Buffer.from('0000000000120000303900000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db0000000500470de4df8200000000000100000000000000000000000000000000000000000000000000000000000000000000000000000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000005002386f26fc10000000000010000000000000056506c6174666f726d564d207574696c697479206d6574686f64206275696c644578706f7274547820746f206578706f727420415641582066726f6d2074686520502d436861696e20746f2074686520432d436861696e9d0775f450604bd2fbc49ce0c5c1c6dfeb2dc2acb8c92c26eeae6e6df4502b1900000001dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000007006a94d713a83600000000000000000000000001000000013cb7d3842e8cee6a0ebd09f1fe884f6861e1b29c', 'hex');
    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const signPrompt = {header:"Sign",body:"Export"};
    const exportPrompt = {header:"P chain export",body:'29999999 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'};
    const feePrompt = {header:"Fee",body:"1 AVAX"};
    const prompts = chunkPrompts([
      signPrompt, exportPrompt, feePrompt
    ]).concat([[finalizePrompt]]);

    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

  it('can sign a transaction importing to P-chain from C-chain', async function() {
    // Collected from avalanchejs examples:
    const txn = Buffer.from('000000000000000030399d0775f450604bd2fbc49ce0c5c1c6dfeb2dc2acb8c92c26eeae6e6df4502b190000000000000000000000000000000000000000000000000000000000000000000000011d77d94aaefd25c0c2544acaff85290690737d7f0234d3fc754276b40f98d5d900000000dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db00000005006a94d713a836000000000100000000000000018db97c7cece249c2b98bdc0226cc4c2a57bf52fc00619ac63f788a00dbcf890f77f49b96857648b72b77f9f82937f28a68704af05da0dc12ba53f2db', 'hex');
    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const signPrompt = {header:"Sign",body:"Import"};
    const importPrompt = {header:"Importing",body:'27473249 AVAX to local13kuhcl8vufyu9wvtmspzdnzv9ftm75hunmtqe9'};
    const feePrompt = {header:"Fee",body:"2526750 AVAX"};
    const prompts = chunkPrompts([
      signPrompt, importPrompt, feePrompt
    ]).concat([[finalizePrompt]]);

    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });

});
describe('Staking tests', async function () {
  it('can sign an add validator transaction', async function () {
    const txn = Buffer.from([
      0x00, 0x00,
      0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x30, 0x39,
      // blockchain ID
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // number of outputs
      0x00, 0x00, 0x00, 0x01,
      // output
      ... localAssetId,
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0xee, 0x5b, 0xe5, 0xc0, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      // number of inputs
      0x00, 0x00, 0x00, 0x01,
      // input
      0xdf, 0xaf, 0xbd, 0xf5, 0xc8, 0x1f, 0x63, 0x5c,
      0x92, 0x57, 0x82, 0x4f, 0xf2, 0x1c, 0x8e, 0x3e,
      0x6f, 0x7b, 0x63, 0x2a, 0xc3, 0x06, 0xe1, 0x14,
      0x46, 0xee, 0x54, 0x0d, 0x34, 0x71, 0x1a, 0x15,
      // addresses?
      0x00, 0x00, 0x00, 0x01,

      ... localAssetId,

      0x00, 0x00, 0x00, 0x05,

      // Have to tweak this up from the serialization reference, because we need
      // enough to stake.
      // 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00,
      0x00, 0x00, 0x01, 0xd2, 0x97, 0xb5, 0x48, 0x00,
      0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00,
      // memo length
      0x00, 0x00, 0x00, 0x00,
      // Node ID
      0xe9, 0x09, 0x4f, 0x73, 0x69, 0x80, 0x02, 0xfd,
      0x52, 0xc9, 0x08, 0x19, 0xb4, 0x57, 0xb9, 0xfb,
      0xc8, 0x66, 0xab, 0x80,
      // StartTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x21, 0xf3, 0x1d,
      // EndTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x49, 0x7d, 0xc6,
      // Weight
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      // Stake
      0x00, 0x00, 0x00, 0x01,
      // Stake asset
      ... localAssetId,
      0x00, 0x00, 0x00, 0x07,
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a,
      0x0e, 0xbd, 0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68,
      0x61, 0xe1, 0xb2, 0x9c,
      // RewardsOwner
      0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      // Shares
      0x00, 0x00, 0x00, 0x64]);

    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const prompts = chunkPrompts([
      {header: 'Sign', body: 'Add Validator'},
      {header: 'Transfer', body: '3.999 AVAX to local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n'},
      {header: 'Validator', body: 'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN' },
      {header: 'Start time', body: '2020-07-29 22:07:25 UTC' },
      {header: 'End time', body: '2020-08-28 21:57:26 UTC' },
      {header: 'Total Stake', body: '2000 AVAX' },
      {header: 'Stake',body: '2000 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'},
      {header: 'Rewards To', body: 'local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n' },
      {header: 'Delegation Fee', body: '0.01%' },
      {header: 'Fee',body: '0.001 AVAX'},
    ]).concat([[finalizePrompt]]);
    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });
  it('Rejects an add validator transaction if total stake is not sum of stake UTXOs', async function () {
    try {
      const txn = Buffer.from([
        0x00, 0x00,
        0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x30, 0x39,
        // blockchain ID
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        // number of outputs
        0x00, 0x00, 0x00, 0x01,
        // output
        ... localAssetId,
        0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
        0xee, 0x5b, 0xe5, 0xc0, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
        0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
        0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
        // number of inputs
        0x00, 0x00, 0x00, 0x01,
        // input
        0xdf, 0xaf, 0xbd, 0xf5, 0xc8, 0x1f, 0x63, 0x5c,
        0x92, 0x57, 0x82, 0x4f, 0xf2, 0x1c, 0x8e, 0x3e,
        0x6f, 0x7b, 0x63, 0x2a, 0xc3, 0x06, 0xe1, 0x14,
        0x46, 0xee, 0x54, 0x0d, 0x34, 0x71, 0x1a, 0x15,
        // addresses?
        0x00, 0x00, 0x00, 0x01,

        ... localAssetId,

        0x00, 0x00, 0x00, 0x05,

        // Have to tweak this up from the serialization reference, because we need
        // enough to stake.
        // 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00,
        0x00, 0x00, 0x01, 0xd2, 0x97, 0xb5, 0x48, 0x00,
        0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x00,
        // memo length
        0x00, 0x00, 0x00, 0x00,
        // Node ID
        0xe9, 0x09, 0x4f, 0x73, 0x69, 0x80, 0x02, 0xfd,
        0x52, 0xc9, 0x08, 0x19, 0xb4, 0x57, 0xb9, 0xfb,
        0xc8, 0x66, 0xab, 0x80,
        // StartTime
        0x00, 0x00, 0x00, 0x00, 0x5f, 0x21, 0xf3, 0x1d,
        // EndTime
        0x00, 0x00, 0x00, 0x00, 0x5f, 0x49, 0x7d, 0xc6,
        // Weight
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd4, 0x31,
        // Stake
        0x00, 0x00, 0x00, 0x01,
        // Stake asset
        ... localAssetId,
        0x00, 0x00, 0x00, 0x07,
        0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a,
        0x0e, 0xbd, 0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68,
        0x61, 0xe1, 0xb2, 0x9c,
        // RewardsOwner
        0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
        0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
        0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
        // Shares
        0x00, 0x00, 0x00, 0x64]);

      const pathPrefix = "44'/9000'/0'";
      const pathSuffixes = ["0/0", "0/1", "100/100"];
      const prompts = chunkPrompts([
        {header: 'Sign', body: 'Add Validator'},
        {header: 'Transfer', body: '3.999 AVAX to local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n'},
        {header: 'Validator', body: 'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN' },
        {header: 'Start time', body: '2020-07-29 22:07:25 UTC' },
        {header: 'End time', body: '2020-08-28 21:57:26 UTC' },
        {header: 'Total Stake', body: '0.000054321 AVAX' },
        {header: 'Stake',body: '2000 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'}
      ]);
      const ui = await flowMultiPrompt(this.speculos, prompts, "Next", "Next");
      const sigPromise = this.ava.signTransaction(
        BIPPath.fromString(pathPrefix),
        pathSuffixes.map(x => BIPPath.fromString(x, false)),
        txn,
      );
      await sigPromise;
      await ui.promptsPromise;
    } catch(e) {
      expect(e).has.property('statusCode', 0x9405);
    }
  });

  it('can sign an add delegator transaction', async function () {
    const txn = Buffer.from([
      0x00, 0x00,
      // base tx:
      0x00, 0x00, 0x00, 0x0e, 0x00, 0x00, 0x30, 0x39,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x01,
      ... localAssetId,
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0xee, 0x5b, 0xe5, 0xc0, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      0x00, 0x00, 0x00, 0x01,
      0xdf, 0xaf, 0xbd, 0xf5, 0xc8, 0x1f, 0x63, 0x5c,
      0x92, 0x57, 0x82, 0x4f, 0xf2, 0x1c, 0x8e, 0x3e,
      0x6f, 0x7b, 0x63, 0x2a, 0xc3, 0x06, 0xe1, 0x14,
      0x46, 0xee, 0x54, 0x0d, 0x34, 0x71, 0x1a, 0x15,
      0x00, 0x00, 0x00, 0x01,
      ... localAssetId,
      0x00, 0x00, 0x00, 0x05,

      // Have to override relative to the reference, as this
      // doesn't provide enough funds for stake.
      // 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00,
      0x00, 0x00, 0x01, 0xd2, 0x97, 0xb5, 0x48, 0x00,
      0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00,
      // Node ID
      0xe9, 0x09, 0x4f, 0x73, 0x69, 0x80, 0x02, 0xfd,
      0x52, 0xc9, 0x08, 0x19, 0xb4, 0x57, 0xb9, 0xfb,
      0xc8, 0x66, 0xab, 0x80,
      // StartTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x21, 0xf3, 0x1d,
      // EndTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x49, 0x7d, 0xc6,
      // Weight
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      // Stake
      0x00, 0x00, 0x00, 0x01,
      ... localAssetId,
      0x00, 0x00, 0x00, 0x07,
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a,
      0x0e, 0xbd, 0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68,
      0x61, 0xe1, 0xb2, 0x9c,
      // RewardsOwner
      0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
    ]);
    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const prompts = chunkPrompts([{header: 'Sign', body: 'Add Delegator'},
      {header: 'Transfer', body: '3.999 AVAX to local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n'},
      {header: 'Validator', body: 'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN' },
      {header: 'Start time', body: '2020-07-29 22:07:25 UTC' },
      {header: 'End time', body: '2020-08-28 21:57:26 UTC' },
      {header: 'Total Stake', body: '2000 AVAX' },
      {header: 'Stake', body: '2000 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'},
      {header: 'Rewards To', body: 'local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n' },
      {header: 'Fee', body: '0.001 AVAX'},
    ]).concat([[finalizePrompt]]);
    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });
  it('rejects an add delegator transaction where weight is not sum of stake', async function () {
    try {
      const txn = Buffer.from([
        0x00, 0x00,
        // base tx:
        0x00, 0x00, 0x00, 0x0e, 0x00, 0x00, 0x30, 0x39,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x01,
        ... localAssetId,
        0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
        0xee, 0x5b, 0xe5, 0xc0, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
        0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
        0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
        0x00, 0x00, 0x00, 0x01,
        0xdf, 0xaf, 0xbd, 0xf5, 0xc8, 0x1f, 0x63, 0x5c,
        0x92, 0x57, 0x82, 0x4f, 0xf2, 0x1c, 0x8e, 0x3e,
        0x6f, 0x7b, 0x63, 0x2a, 0xc3, 0x06, 0xe1, 0x14,
        0x46, 0xee, 0x54, 0x0d, 0x34, 0x71, 0x1a, 0x15,
        0x00, 0x00, 0x00, 0x01,
        ... localAssetId,
        0x00, 0x00, 0x00, 0x05,

        // Have to override relative to the reference, as this
        // doesn't provide enough funds for stake.
        // 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00,
        0x00, 0x00, 0x01, 0xd2, 0x97, 0xb5, 0x48, 0x00,
        0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00,
        // Node ID
        0xe9, 0x09, 0x4f, 0x73, 0x69, 0x80, 0x02, 0xfd,
        0x52, 0xc9, 0x08, 0x19, 0xb4, 0x57, 0xb9, 0xfb,
        0xc8, 0x66, 0xab, 0x80,
        // StartTime
        0x00, 0x00, 0x00, 0x00, 0x5f, 0x21, 0xf3, 0x1d,
        // EndTime
        0x00, 0x00, 0x00, 0x00, 0x5f, 0x49, 0x7d, 0xc6,
        // Weight
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xd4, 0x31,
        // Stake
        0x00, 0x00, 0x00, 0x01,
        ... localAssetId,
        0x00, 0x00, 0x00, 0x07,
        0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a,
        0x0e, 0xbd, 0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68,
        0x61, 0xe1, 0xb2, 0x9c,
        // RewardsOwner
        0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
        0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
        0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
        0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      ]);
      const pathPrefix = "44'/9000'/0'";
      const pathSuffixes = ["0/0", "0/1", "100/100"];
      const prompts = chunkPrompts([{header: 'Sign', body: 'Add Delegator'},
      {header: 'Transfer', body: '3.999 AVAX to local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n'},
      {header: 'Validator', body: 'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN' },
      {header: 'Start time', body: '2020-07-29 22:07:25 UTC' },
      {header: 'End time', body: '2020-08-28 21:57:26 UTC' },
      {header: 'Total Stake', body: '0.000054321 AVAX' },
      {header: 'Stake', body: '2000 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'}
      ]);
      const ui = await flowMultiPrompt(this.speculos, prompts, "Next", "Next");
      const sigPromise = this.ava.signTransaction(
        BIPPath.fromString(pathPrefix),
        pathSuffixes.map(x => BIPPath.fromString(x, false)),
        txn,
      );
      await sigPromise;
      await ui.promptsPromise;
    } catch(e) {
      expect(e).has.property('statusCode', 0x9405);
    }
  });
  it('can sign an add validator transaction where some funds are locked', async function () {
    const txn = Buffer.from([
      0x00, 0x00,
      0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x30, 0x39,
      // blockchain ID
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      // number of outputs
      0x00, 0x00, 0x00, 0x01,
      // output
      ... localAssetId,
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0xee, 0x5b, 0xe5, 0xc0, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      // number of inputs
      0x00, 0x00, 0x00, 0x01,
      // input

      0xdf, 0xaf, 0xbd, 0xf5, 0xc8, 0x1f, 0x63, 0x5c,
      0x92, 0x57, 0x82, 0x4f, 0xf2, 0x1c, 0x8e, 0x3e,
      0x6f, 0x7b, 0x63, 0x2a, 0xc3, 0x06, 0xe1, 0x14,
      0x46, 0xee, 0x54, 0x0d, 0x34, 0x71, 0x1a, 0x15,
      // UTXOIndex
      0x00, 0x00, 0x00, 0x01,

      ... localAssetId,

      // StakeableLockInput
      0x00, 0x00, 0x00, 0x15,
      0x00, 0x00, 0x00, 0x00, 0x60, 0x4b, 0x72, 0x5e,

      // SECP256K1TransferInput nested in Stakeable
      0x00, 0x00, 0x00, 0x05,

      // Have to tweak this up from the serialization reference, because we need
      // enough to stake.
      // 0x00, 0x00, 0x00, 0x00, 0xee, 0x6b, 0x28, 0x00,
      0x00, 0x00, 0x01, 0xd2, 0x97, 0xb5, 0x48, 0x00,
      0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x00,
      // memo length
      0x00, 0x00, 0x00, 0x00,
      // Node ID
      0xe9, 0x09, 0x4f, 0x73, 0x69, 0x80, 0x02, 0xfd,
      0x52, 0xc9, 0x08, 0x19, 0xb4, 0x57, 0xb9, 0xfb,
      0xc8, 0x66, 0xab, 0x80,
      // StartTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x21, 0xf3, 0x1d,
      // EndTime
      0x00, 0x00, 0x00, 0x00, 0x5f, 0x49, 0x7d, 0xc6,
      // Weight
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      // Stake
      0x00, 0x00, 0x00, 0x01,
      // Stake asset
      ... localAssetId,
      // StakeableLockOutput
      0x00, 0x00, 0x00, 0x16,
      0x00, 0x00, 0x00, 0x00, 0x60, 0x4b, 0x72, 0x5e,
      // nested SECP256K1TransferOutput
      0x00, 0x00, 0x00, 0x07,
      0x00, 0x00, 0x01, 0xd1, 0xa9, 0x4a, 0x20, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x3c, 0xb7, 0xd3, 0x84, 0x2e, 0x8c, 0xee, 0x6a,
      0x0e, 0xbd, 0x09, 0xf1, 0xfe, 0x88, 0x4f, 0x68,
      0x61, 0xe1, 0xb2, 0x9c,
      // RewardsOwner
      0x00, 0x00, 0x00, 0x0b, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xda, 0x2b, 0xee, 0x01,
      0xbe, 0x82, 0xec, 0xc0, 0x0c, 0x34, 0xf3, 0x61,
      0xed, 0xa8, 0xeb, 0x30, 0xfb, 0x5a, 0x71, 0x5c,
      // Shares
      0x00, 0x00, 0x00, 0x64]);

    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const prompts = chunkPrompts([{header: 'Sign', body: 'Add Validator'},
      {header: 'Transfer', body: '3.999 AVAX to local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n'},
      {header: 'Validator', body: 'NodeID-NFBbbJ4qCmNaCzeW7sxErhvWqvEQMnYcN' },
      {header: 'Start time', body: '2020-07-29 22:07:25 UTC' },
      {header: 'End time', body: '2020-08-28 21:57:26 UTC' },
      {header: 'Total Stake', body: '2000 AVAX' },
      {header: 'Stake',body: '2000 AVAX to local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u'},
      {header: 'Funds locked', body: '2000 AVAX until 2021-03-12 13:53:34 UTC'},
      {header: 'Rewards To', body: 'local1mg47uqd7stkvqrp57ds7m28txra45u2uzkta8n' },
      {header: 'Delegation Fee', body: '0.01%' },
      {header: 'Fee',body: '0.001 AVAX'}
    ]).concat([[finalizePrompt]]);
    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });
  it('can sign a live add validator transaction where some funds are locked', async function () {
    const txn = Buffer.from([
      0x00, 0x00,
      0x00, 0x00, 0x00, 0x0C, 0x00, 0x00, 0x00, 0x05,

      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

      0x00, 0x00, 0x00, 0x01,

      0x3D, 0x9B, 0xDA, 0xC0, 0xED, 0x1D, 0x76, 0x13,
      0x30, 0xCF, 0x68, 0x0E, 0xFD, 0xEB, 0x1A, 0x42,
      0x15, 0x9E, 0xB3, 0x87, 0xD6, 0xD2, 0x95, 0x0C,
      0x96, 0xF7, 0xD2, 0x8F, 0x61, 0xBB, 0xE2, 0xAA,
      // StakeableLockOut
      0x00, 0x00, 0x00, 0x16,
      0x00, 0x00, 0x00, 0x00, 0x60, 0xB5, 0x54, 0xE0,
      // Nested Output
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0x1D, 0xCD, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xEC, 0x0C, 0xD0, 0xA6,
      0x1B, 0xED, 0xCE, 0xE0, 0x0F, 0x5B, 0x39, 0x36,
      0x97, 0x43, 0x34, 0xCD, 0x43, 0xD2, 0xA5, 0xD3,
      // Inputs
      0x00, 0x00, 0x00, 0x01,
      0x3D, 0x43, 0x9C, 0xCE, 0x13, 0x78, 0xC6, 0x7A,
      0x3E, 0x7A, 0x81, 0x20, 0x82, 0x45, 0x06, 0xC5,
      0x39, 0x41, 0x2B, 0x24, 0x29, 0x02, 0xED, 0xE4,
      0x5E, 0x7D, 0x4E, 0xCF, 0x6E, 0x10, 0xA6, 0xB6,

      0x00, 0x00, 0x00, 0x00,
      0x3D, 0x9B, 0xDA, 0xC0, 0xED, 0x1D, 0x76, 0x13,
      0x30, 0xCF, 0x68, 0x0E, 0xFD, 0xEB, 0x1A, 0x42,
      0x15, 0x9E, 0xB3, 0x87, 0xD6, 0xD2, 0x95, 0x0C,
      0x96, 0xF7, 0xD2, 0x8F, 0x61, 0xBB, 0xE2, 0xAA,
      // StakeableLockIn
      0x00, 0x00, 0x00, 0x15,
      0x00, 0x00, 0x00, 0x00, 0x60, 0xB5, 0x54, 0xE0,
      // Nested input
      0x00, 0x00, 0x00, 0x05,
      0x00, 0x00, 0x00, 0x00, 0x59, 0x68, 0x2F, 0x00,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,

      0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00,

      // Node ID
      0xDE, 0x31, 0xB4, 0xD8, 0xB2, 0x29, 0x91, 0xD5,
      0x1A, 0xA6, 0xAA, 0x1F, 0xC7, 0x33, 0xF2, 0x3A,
      0x85, 0x1A, 0x8C, 0x94,

      // Start time
      0x00, 0x00, 0x00, 0x00, 0x60, 0x4F, 0xBE, 0x07,
      // End time
      0x00, 0x00, 0x00, 0x00, 0x62, 0x30, 0xEF, 0x2F,
      // Weight
      0x00, 0x00, 0x00, 0x00, 0x3B, 0x9A, 0xCA, 0x00,
      // Stake:
      0x00, 0x00, 0x00, 0x01,

      0x3D, 0x9B, 0xDA, 0xC0, 0xED, 0x1D, 0x76, 0x13,
      0x30, 0xCF, 0x68, 0x0E, 0xFD, 0xEB, 0x1A, 0x42,
      0x15, 0x9E, 0xB3, 0x87, 0xD6, 0xD2, 0x95, 0x0C,
      0x96, 0xF7, 0xD2, 0x8F, 0x61, 0xBB, 0xE2, 0xAA,
      // StakeableLockOut
      0x00, 0x00, 0x00, 0x16,
      0x00, 0x00, 0x00, 0x00, 0x60, 0xB5, 0x54, 0xE0,
      // Nested output
      0x00, 0x00, 0x00, 0x07, 0x00, 0x00, 0x00, 0x00,
      0x3B, 0x9A, 0xCA, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xEC, 0x0C, 0xD0, 0xA6,
      0x1B, 0xED, 0xCE, 0xE0, 0x0F, 0x5B, 0x39, 0x36,
      0x97, 0x43, 0x34, 0xCD, 0x43, 0xD2, 0xA5, 0xD3,

      // Rewards owner
      0x00, 0x00, 0x00, 0x0B, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x01, 0xB6, 0x6C, 0x0D, 0x31,
      0x28, 0xA6, 0x81, 0x2A, 0x30, 0xC9, 0xBF, 0xDC,
      0x2D, 0xA0, 0x99, 0x92, 0x4D, 0x0C, 0x08, 0x1F,

      // Shares
      0x00, 0x00, 0x4E, 0x20,

      ]);

    const pathPrefix = "44'/9000'/0'";
    const pathSuffixes = ["0/0", "0/1", "100/100"];
    const prompts = chunkPrompts([{header: 'Sign', body: 'Add Validator'},
      {header: 'Transfer', body: '0.5 AVAX to fuji1asxdpfsmah8wqr6m8ymfwse5e4pa9fwnvudmpn'},
      {header: 'Funds locked', body: '0.5 AVAX until 2021-05-31 21:28:00 UTC'},
      {header: 'Validator', body: 'NodeID-MFrZFVCXPv5iCn6M9K6XduxGTYp891xXZ'},
      {header: 'Start time', body: '2021-03-15 20:05:27 UTC'},
      {header: 'End time', body: '2022-03-15 19:55:27 UTC'},
      {header: 'Total Stake', body: '1 AVAX'},
      {header: 'Stake', body: '1 AVAX to fuji1asxdpfsmah8wqr6m8ymfwse5e4pa9fwnvudmpn'},
      {header: 'Funds locked', body: '1 AVAX until 2021-05-31 21:28:00 UTC'},
      {header: 'Rewards To', body: 'fuji1kekq6vfg56qj5vxfhlwzmgyejfxsczqld3kdup'},
      {header: 'Delegation Fee', body: '2%'},
      {header: 'Fee', body: '0 AVAX'}
    ]).concat([[finalizePrompt]]);
    const ui = await flowMultiPrompt(this.speculos, prompts);
    const sigPromise = this.ava.signTransaction(
      BIPPath.fromString(pathPrefix),
      pathSuffixes.map(x => BIPPath.fromString(x, false)),
      txn,
    );
    await sigPromise;
    await ui.promptsPromise;
  });
});
