# -*- coding: utf-8 -*-

"""Tests of CCG functions."""

#------------------------------------------------------------------------------
# Imports
#------------------------------------------------------------------------------

import numpy as np
from numpy import array_equal as ae
from pytest import raises

from ..ccg import _increment, _diff_shifted, Correlograms


#------------------------------------------------------------------------------
# Tests
#------------------------------------------------------------------------------

def test_utils():
    # First, test _increment().

    # Original array.
    arr = np.arange(10)
    # Indices of elements to increment.
    indices = [0, 2, 4, 2, 2, 2, 2, 2, 2]

    ae(_increment(arr, indices), [1, 1, 9, 3, 5, 5, 6, 7, 8, 9])

    # Then, test _shitdiff.
    # Original array.
    arr = [2, 3, 5, 7, 11, 13, 17]
    # Shifted once.
    ds1 = [1, 2, 2, 4, 2, 4]
    # Shifted twice.
    ds2 = [3, 4, 6, 6, 6]

    ae(_diff_shifted(arr, 1), ds1)
    ae(_diff_shifted(arr, 2), ds2)
    ae(_diff_shifted(_diff_shifted(arr)), ds2)


def test_ccg():
    sr = 20000
    nspikes = 10000
    spiketimes = np.cumsum(np.random.exponential(scale=.002, size=nspikes))
    spiketimes = (spiketimes * sr).astype(np.int64)
    maxcluster = 10
    spike_clusters = np.random.randint(0, maxcluster, nspikes)

    winsize_samples = 2*(25 * 20) + 1
    binsize = 1 * 20  # 1 ms
    winsize_bins = 2 * ((winsize_samples // 2) // binsize) + 1
    assert winsize_bins % 2 == 1

    c = Correlograms(spiketimes, binsize, winsize_bins)
    correlograms = c.compute(spike_clusters, [])
    assert correlograms.shape == (1000, 1000, 26)