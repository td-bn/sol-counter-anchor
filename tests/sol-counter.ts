import * as anchor from '@project-serum/anchor';
import * as assert from 'assert';
import { Program } from '@project-serum/anchor';
import { SolCounter } from '../target/types/sol_counter';

describe('sol-counter', () => {

  // Configure the client to use the local cluster.
  const SystemProgram = anchor.web3.SystemProgram;
  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.SolCounter as Program<SolCounter>;

  let baseAccount;
  it('should create a counter', async () => {
    baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    // Fetch account and count
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.count.toString() === '0')
  })

  it('should increment a counter', async () => {
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey
      }
    })    
    // Fetch account and count
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.count.toString() === '1')
  })
});
