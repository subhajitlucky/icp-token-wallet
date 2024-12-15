export const idlFactory = ({ IDL }) => {
    const Account = IDL.Text;
  
    return IDL.Service({
      'icrc2_allowance' : IDL.Func([Account, Account], [IDL.Nat64], ['query']),
      'icrc2_approve' : IDL.Func([Account, IDL.Nat64], [IDL.Bool], []),
      'icrc2_balance_of' : IDL.Func([Account], [IDL.Nat64], ['query']),
      'init' : IDL.Func([], [], []),
      'icrc2_metadata' : IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))], ['query']),
      'icrc2_total_supply' : IDL.Func([], [IDL.Nat64], ['query']),
      'icrc2_transfer' : IDL.Func([Account, IDL.Nat64], [IDL.Bool], []),
    });
  };
  
  export const init = ({ IDL }) => { return []; };
  