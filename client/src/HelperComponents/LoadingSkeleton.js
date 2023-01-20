import React from 'react';
import './LoadingSkeleton.css'
import { useState, useEffect } from 'react';

function LoadingSkeleton() {


  return (
    <a className="card" id="card-link" target="_blank">
        <div className="card__header">
            <div>
            <div className="logo-image card__header header__img skeleton" id="logo-img" alt="" />
            </div>
            <h3 className="card__header header__title" id="card-title">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            </h3>
        </div>

        <div className="card__body">
            <div className="card__body body__text" id="card-details">
            <div className="skeleton skeleton-text skeleton-text__body"></div>
            </div>

            <div className="card__body body__img">
            <div className="skeleton body-image" alt="" id="cover-img" />
            </div>
        </div>

        <div className="card__footer" id="card-footer">
            <div className="skeleton skeleton-text skeleton-footer"></div>
        </div>
    </a>
  );
}

export default LoadingSkeleton;