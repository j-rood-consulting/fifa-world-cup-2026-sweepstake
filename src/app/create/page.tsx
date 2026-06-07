import { createPool } from "@/lib/actions";

export default function CreatePoolPage() {
  return (
    <main className="dashboard-grid">
      <section>
        <p className="eyebrow">Create pool</p>
        <h1>Set it up fast, or tune the details.</h1>
        <p className="lead">
          Quick Draw uses the tournament defaults. Advanced setup adds payment notes, prize structure, and tighter pool controls.
        </p>
      </section>

      <section className="panel panel-pad">
        <form action={createPool} className="form-stack">
          <div className="field">
            <label htmlFor="setupMode">Setup mode</label>
            <select id="setupMode" name="setupMode" defaultValue="quick">
              <option value="quick">Quick Draw</option>
              <option value="advanced">Advanced Setup</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="name">Pool name</label>
            <input id="name" name="name" placeholder="Friday night sweepstake" required />
          </div>
          <div className="field">
            <label htmlFor="adminName">Admin name</label>
            <input id="adminName" name="adminName" placeholder="Jamie" required />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="playerCap">Player cap</label>
              <input id="playerCap" name="playerCap" type="number" min="2" max="48" placeholder="Optional" />
            </div>
            <div className="field">
              <label htmlFor="minimumPlayers">Minimum players</label>
              <input id="minimumPlayers" name="minimumPlayers" type="number" min="2" max="48" defaultValue="2" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="drawDeadline">Draw deadline</label>
            <input id="drawDeadline" name="drawDeadline" type="datetime-local" />
          </div>
          <div className="notice">
            <strong>Advanced fields</strong>
            <p className="muted" style={{ margin: "6px 0 0" }}>
              Leave these blank for Quick Draw. Fill them in when the pool needs payment tracking or prize notes.
            </p>
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="entryFeeAmount">Entry fee</label>
              <input id="entryFeeAmount" name="entryFeeAmount" placeholder="10" />
            </div>
            <div className="field">
              <label htmlFor="currency">Currency</label>
              <input id="currency" name="currency" placeholder="GBP" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="paymentAccountHolder">Account holder</label>
            <input id="paymentAccountHolder" name="paymentAccountHolder" />
          </div>
          <div className="two-col">
            <div className="field">
              <label htmlFor="paymentBankName">Bank name</label>
              <input id="paymentBankName" name="paymentBankName" />
            </div>
            <div className="field">
              <label htmlFor="paymentBranchCode">Branch / sort code</label>
              <input id="paymentBranchCode" name="paymentBranchCode" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="paymentAccountNumber">Account number</label>
            <input id="paymentAccountNumber" name="paymentAccountNumber" />
          </div>
          <div className="field">
            <label htmlFor="paymentReference">Payment reference instruction</label>
            <input id="paymentReference" name="paymentReference" placeholder="Use your name as reference" />
          </div>
          <div className="field">
            <label htmlFor="prizeStructureJson">Prize structure</label>
            <textarea id="prizeStructureJson" name="prizeStructureJson" placeholder="Winner 80%, runner-up 20%" />
          </div>
          <div className="field">
            <label htmlFor="rulesNote">Pool rules note</label>
            <textarea id="rulesNote" name="rulesNote" placeholder="Any notes players should see before joining" />
          </div>
          <button className="button" type="submit">Create pool</button>
        </form>
      </section>
    </main>
  );
}
