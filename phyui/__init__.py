# -*- coding: utf-8 -*-

import os

from IPython.html import nbextensions

__author__ = 'kwikteam'
__email__ = 'rossant at github'
__version__ = '0.1.0-alpha'

__all__ = ( 'session', 'UISession' )

from ._session import session

def prepare_js():
    """ This is needed to map js/css to the nbextensions folder
    """
    pkgdir = os.path.join(os.path.dirname(__file__), "static")
    nbextensions.install_nbextension(pkgdir, symlink=True, user=True,
                                     destination='phyui')

prepare_js()
