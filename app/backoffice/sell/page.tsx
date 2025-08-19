'use client';

import { useEffect, useState } from "react";
import { config }from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page() {
    return (
        <div>
            <div className="content-header">ขายสินค้า</div>
            <div className="flex gap-2">
                <input className="form-control" type="text" placeholder="serial"/>
                <button className="btn flex items-center">
                    <i className="fa-solid fa-save mr-2"></i>
                    บันทึก
                </button>
            </div>
        </div>
    )
}