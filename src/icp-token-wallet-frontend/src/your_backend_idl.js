export const idlFactory = ({ IDL }) => {
    const Account = IDL.Text;
    return IDL.Service({
      'allowance' : IDL.Func([Account, Account], [IDL.Nat64], ['query']),
      'approve' : IDL.Func([Account, IDL.Nat64], [IDL.Bool], []),
      'balance_of' : IDL.Func([Account], [IDL.Nat64], ['query']),
      'init' : IDL.Func([], [], []),
      'transfer' : IDL.Func([Account, IDL.Nat64], [IDL.Bool], []),
    });
  };
  export const init = ({ IDL }) => { return []; };