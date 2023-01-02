import React from 'react';
import './LoadingSkeleton.css'
import { useState, useEffect } from 'react';

function LoadingSkeleton() {


  return (
    <a class="card" id="card-link" target="_blank">
        <div class="card__header">
            <div>
            <div class="logo-image card__header header__img skeleton" id="logo-img" alt="" />
            </div>
            <h3 class="card__header header__title" id="card-title">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            </h3>
        </div>

        <div class="card__body">
            <div class="card__body body__text" id="card-details">
            <div class="skeleton skeleton-text skeleton-text__body"></div>
            </div>

            <div class="card__body body__img">
            <div class="skeleton body-image" alt="" id="cover-img" />
            </div>
        </div>

        <div class="card__footer" id="card-footer">
            <div class="skeleton skeleton-text skeleton-footer"></div>
        </div>
    </a>
  );
}

export default LoadingSkeleton;