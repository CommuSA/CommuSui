// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module datalabel::data_label {
    use std::string::{String, utf8};

    use sui::object::{Self, UID};
    use sui::tx_context::{TxContext, sender};
    use sui::package;
    use sui::display;

    /// our datalabel struct.
    public struct DataLabeling has key, store {
        id: UID,
        name: String,
        url: String,
        description: String,
        sKey: String,
    }

    /// our OTW to create display.
    public struct DATA_LABEL has drop {}

    // It's recommened to create Display using PTBs instead of
    // directly on the contracts.
    // We are only creating it here for datalabel purposes (one-step setup).
    fun init(otw: DATA_LABEL, ctx: &mut TxContext){
        let publisher = package::claim(otw, ctx);
         let keys = vector[
            utf8(b"name"),
            utf8(b"url"),
            utf8(b"description"),
            utf8(b"sKey"),
        ];


        let values = vector[
            // Let's add a datalabel name for our `DataLabeling`
            utf8(b"{name}"),
            // Adding a happy bear image.
            utf8(b"https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9sYXIlMjBiZWFyfGVufDB8fDB8fHww"),
            // Description is static for all bears out there.
            utf8(b"The greatest figure for demos"),
            utf8(b"specter"),

        ];

        // Get a new `Display` object for the `Hero` type.
        let mut display = display::new_with_fields<DataLabeling>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        sui::transfer::public_transfer(display, ctx.sender());
        sui::transfer::public_transfer(publisher, ctx.sender())
    }

    public fun new(name: String, url: String, description: String, sKey: String,    ctx: &mut TxContext): DataLabeling {
        DataLabeling {
            id: object::new(ctx),
            name,
            url,
            description,
            sKey,
        }
    }

    public fun delete_data(data: DataLabeling, _ctx: &mut TxContext) {
        let DataLabeling {id, name: _name, url: _url, description: _description, sKey: _sKey} = data;
        sui::object::delete(id)
    }
}
