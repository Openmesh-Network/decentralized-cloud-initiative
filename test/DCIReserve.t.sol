// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "../lib/forge-std/src/Test.sol";
import {DCIReserve} from "../src/DCIReserve.sol";

contract DCIReserveTest is Test {
    struct Reserver {
        address account;
        uint256 amount;
    }

    function deployDCI(uint256 available) internal returns (DCIReserve) {
        return new DCIReserve(available);
    }

    function test_Reserve(uint256 available, Reserver[] memory reserve) public {
        DCIReserve dci = deployDCI(available);
        uint256 totalReserved = 0;
        for (uint256 i = 0; i < reserve.length; i++) {
            uint256 expectedAvailable;
            if (totalReserved > available) {
                expectedAvailable = 0;
            } else {
                expectedAvailable = available - totalReserved;
            }
            vm.assertEq(dci.available(), expectedAvailable);

            vm.prank(reserve[i].account);
            dci.reserve(reserve[i].amount);
            if (totalReserved > type(uint256).max - reserve[i].amount) {
                // Prevent overflow on total reserved
                totalReserved = type(uint256).max;
            } else {
                totalReserved += reserve[i].amount;
            }
        }
    }

    event Reserved(address indexed account, uint256 amount);
    event Waitlisted(address indexed account, uint256 amount);

    function test_ReserveEvents(uint256 available, Reserver memory reserve) public {
        DCIReserve dci = deployDCI(available);

        if (reserve.amount > available) {
            vm.expectEmit(address(dci));
            emit Waitlisted(reserve.account, reserve.amount - available);
            if (available != 0) {
                vm.expectEmit(address(dci));
                emit Reserved(reserve.account, available);
            }
        } else {
            vm.expectEmit(address(dci));
            emit Reserved(reserve.account, reserve.amount);
        }

        vm.prank(reserve.account);
        dci.reserve(reserve.amount);
    }
}
